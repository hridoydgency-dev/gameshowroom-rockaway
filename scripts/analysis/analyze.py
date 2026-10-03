"""Search-intelligence engine: classifies PPC + GSC queries into intent/cluster taxonomy.
Outputs aggregated (non-PII) intelligence used by the website and docs."""
import pandas as pd, re, json, collections, os, glob
# Raw exports live in data-private/ (git-ignored, confidential). Outputs go to data/.
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
PRIV = os.path.join(ROOT, 'data-private')
OUT = os.path.join(ROOT, 'data')
def find(pat):
    m = glob.glob(os.path.join(PRIV, pat))
    if not m: raise SystemExit(f'Missing {pat} in data-private/ — export it from Google Ads / GSC first')
    return m[0]

BD = find('*birthday*Search*terms*.csv')
GS = find('*gameShow*Search*terms*.csv')

def load_ppc(f, campaign):
    d = pd.read_csv(f, skiprows=2, thousands=',')
    d = d[~d['Search term'].astype(str).str.startswith('Total')].copy()
    d['campaign'] = campaign
    for c in ['Clicks', 'Cost', 'Impr.', 'Conversions', 'Conv. value']:
        d[c] = pd.to_numeric(d[c], errors='coerce').fillna(0)
    d['term'] = d['Search term'].str.lower().str.strip()
    return d

ppc_raw = pd.concat([load_ppc(BD, 'birthday'), load_ppc(GS, 'game_show')])
ppc = ppc_raw.groupby(['term', 'campaign']).agg(
    clicks=('Clicks', 'sum'), cost=('Cost', 'sum'), impr=('Impr.', 'sum'),
    conv=('Conversions', 'sum'), excluded=('Added/Excluded', lambda s: (s == 'Excluded').any()),
    keywords=('Keyword', lambda s: sorted(set(s))[:3])).reset_index()

gsc = pd.read_csv(find('*Queries.csv'))
gsc.columns = ['term', 'clicks', 'impr', 'ctr', 'pos']
gsc['term'] = gsc['term'].str.lower().str.strip().str.strip('"')

# ---------------- taxonomy ----------------
COMPETITORS = {
    'great big game show / american dream': r'great big|big game show|american dream|great game show|the great big|greatbiggameshow|big great game|activate|game of 1000 boxes|time mission',
    'game show challenge (freehold)': r'game show challenge|challenge freehold',
    'game show battle rooms': r'battle ?roo|battle tooms|battle show|game battle',
    'dave & busters': r'dave ?(and|&|n) ?buster|d&b',
    'sky zone': r'sky ?zone',
    'chuck e cheese': r'chuck ?e',
    'urban air': r'urban air',
    'funplex': r'funplex',
    'kids empire': r'kids empire',
    'bowlero / bowling': r'bowlero|bowling|lanes',
    'xtreme energy': r'xtreme|extreme energy',
    'giggles playstation': r'giggles',
    'sunshine village': r'sunshine village',
    'other venue brand': r'topgolf|main event|round ?1|lucky strike|isaac|launch trampoline|altitude|ninja|ifly|pump it up|my gym|little gym|gymboree|legoland|crayola|build a bear|color me mine|painting with a twist|groupon',
}
BRAND = r'game ?show ?room|gameshow ?room|the game show room|all in adventures|mystery room|in the spotlight|301 m(oun)?t hope'
LOCAL_TOWNS = ['rockaway', 'denville', 'dover', 'randolph', 'parsippany', 'wharton', 'roxbury', 'mount arlington',
               'mt arlington', 'morristown', 'boonton', 'ledgewood', 'succasunna', 'kinnelon', 'butler', 'jefferson',
               'hackettstown', 'sparta', 'lake hopatcong', 'mine hill', 'morris county', 'netcong', 'budd lake',
               'west milford', 'montville', 'wayne', 'riverdale', 'pompton', 'hopatcong', 'flanders', 'mount olive',
               'chester', 'madison']
OCCASIONS = {
    'kids_birthday': r'kid|child|toddler|boy|girl|\b([1-9]|1[0-2])(st|nd|rd|th)?\b.*(year|yr|birthday)|year old|\b[1-9]th birthday|1st birthday|baby',
    'teen_birthday': r'teen|1[3-9] ?(year|yr)|13th|14th|15th|sweet ?16|sweet sixteen|quinceañera|quince|tween',
    'adult_milestone_birthday': r'adult|\b(2[1-9]|[3-9]0)(th|st)?\b|21st|for him|for her|husband|wife|boyfriend|girlfriend|mom|dad|men|women',
    'corporate_team_building': r'corporate|team ?build|team outing|company|office|work party|employee|coworker',
    'school_youth_group': r'school|field trip|scout|youth group|class trip|camp',
    'bachelor_bachelorette': r'bachelor|bachelorette',
    'date_night': r'date night|dates|couples',
    'family_outing': r'family',
    'holiday_party': r'holiday|christmas|halloween|new year',
    'graduation': r'graduat',
}
ACTIVITIES = {
    'game_show': r'game ?show|gameshow|family feud|jeopardy|buzzer|trivia|quiz',
    'escape_room': r'escape|ecape|escapre|mystery room',
    'trampoline_active_play': r'trampoline|jump|bounce|ninja|obstacle|ropes',
    'arcade_games': r'arcade|game ?room|gaming|video ?game|vr\b|virtual reality',
    'laser_tag': r'laser',
    'bowling': r'bowl',
    'sports': r'sport|soccer|baseball|basketball|pickleball|archery|golf|skating|skate|swim',
    'arts_crafts': r'paint|craft|pottery|art\b|slime|cook|baking',
    'dining_venue_hall': r'restaurant|hall|venue|banquet|room rental|party room|event space',
}

def rx(p, t):
    return re.search(p, t) is not None

def classify(t):
    comp = next((k for k, p in COMPETITORS.items() if rx(p, t)), None)
    brand = rx(BRAND, t) and not comp
    towns = [x for x in LOCAL_TOWNS if x in t]
    near_me = rx(r'near ?me|nearby|by me|around me|close to me|near.me|within \d+ ?mi|closest', t)
    nj = rx(r'\bnj\b|new jersey|jersey', t)
    other_geo = rx(r'\bnyc\b|new york|\bny\b|times square|brooklyn|queens|long island|philadelphia|\bpa\b|palisades|west nyack|oak brook|new mexico|freehold|east rutherford|paramus|edison|roanoke|virginia|connecticut|\bct\b', t)
    question = rx(r'^(what|how|where|who|when|why|can|do|does|is|are|which)\b|\?', t)
    ideas = rx(r'idea|what to do|things to do|how to|themes?\b|games for|activities for|what are', t)
    trans = rx(r'book|booking|reserv|ticket|price|prices|pricing|cost|how much|package|deal|discount|coupon|groupon|cheap|affordable|gift card|open now|today|tonight', t)
    places = rx(r'place|venue|location|spot|where to|party room|hall|center|centre', t)
    occ = [k for k, p in OCCASIONS.items() if rx(p, t)]
    if rx(r'birthday|bday|b-day|party|parties|sweet ?16|celebrat', t) and not occ:
        occ = ['birthday_general'] if rx(r'birthday|bday|sweet', t) else ['party_general']
    acts = [k for k, p in ACTIVITIES.items() if rx(p, t)]
    # topic
    if rx(ACTIVITIES['game_show'], t) and rx(r'birthday|party|parties', t):
        topic = 'game_show_party'
    elif rx(ACTIVITIES['game_show'], t):
        topic = 'game_show'
    elif rx(ACTIVITIES['escape_room'], t):
        topic = 'escape_room'
    elif rx(r'birthday|bday|sweet ?16|sweet sixteen|quince', t):
        topic = 'birthday'
    elif rx(r'party|parties|celebrat|event', t):
        topic = 'party_event'
    elif rx(r'things to do|activit|fun|entertain|attraction|adventure|play|kids|stuff to do|experience', t):
        topic = 'things_to_do'
    elif rx(r'mall|townsquare|town square|town center', t):
        topic = 'mall_navigational'
    else:
        topic = 'other'
    # intent (primary)
    if brand:
        intent = 'brand'
    elif comp:
        intent = 'competitor'
    elif question and not places:
        intent = 'informational'
    elif ideas and not places and not near_me:
        intent = 'informational'
    elif trans:
        intent = 'transactional'
    elif near_me or towns or places:
        intent = 'local_transactional'
    elif topic in ('game_show', 'game_show_party', 'birthday', 'party_event', 'escape_room'):
        intent = 'commercial_investigation'
    else:
        intent = 'informational'
    # commercial score 0-100
    score = {'brand': 90, 'competitor': 55, 'transactional': 80, 'local_transactional': 85,
             'commercial_investigation': 60, 'informational': 25}[intent]
    if topic in ('game_show', 'game_show_party'):
        score += 10
    if other_geo and not towns:
        score -= 35
    if rx(r'tv|television|to watch|daytime|snl|saturday night|forum|\.com|\bwww\b|videogame|jeopardy game$|hq ', t):
        score -= 40
        intent = 'informational' if intent not in ('competitor',) else intent
    if 'adult_milestone_birthday' in occ and not near_me:
        score -= 10
    if rx(r'toddler|baby|1st birthday|first birthday|\b[1-5] ?(year|yr)', t):
        score -= 25  # min age 6+
    score = max(0, min(100, score))
    return dict(intent=intent, topic=topic, competitor=comp, brand=bool(brand), towns=towns, near_me=near_me,
                nj=nj, other_geo=other_geo, question=question, occasions=occ, activities=acts, commercial=score)

def cluster(t, c):
    """Human-readable semantic cluster (page-mappable)."""
    if c['brand']:
        return 'brand:game-show-room' if 'escape' not in t and 'mystery' not in t else 'brand:sister-escape-rooms'
    if c['competitor']:
        return 'competitor:' + c['competitor']
    tp = c['topic']
    if tp == 'game_show_party':
        return 'game-show-birthday-party'
    if tp == 'game_show':
        if any(o in c['occasions'] for o in ['corporate_team_building']):
            return 'game-show:corporate'
        if rx(r'kid|family|school', t):
            return 'game-show:family-kids-school'
        if c['other_geo'] or rx(r'tv|television|watch|daytime|snl|saturday night|forum|videogame', t):
            return 'game-show:irrelevant-or-out-of-area'
        if c['near_me'] or c['towns'] or c['nj']:
            return 'game-show:local'
        return 'game-show:generic-experience'
    if tp == 'escape_room':
        return 'escape-room:local' if (c['towns'] or 'mall' in t or c['near_me'] or c['nj']) else 'escape-room:generic'
    if tp == 'birthday' or tp == 'party_event':
        occ = c['occasions']
        if 'corporate_team_building' in occ:
            return 'events:corporate-team-building'
        if 'teen_birthday' in occ:
            seg = 'teen'
        elif 'kids_birthday' in occ:
            seg = 'kids'
        elif 'adult_milestone_birthday' in occ:
            seg = 'adult'
        else:
            seg = 'general'
        if c['intent'] == 'informational':
            return f'birthday-ideas:{seg}'
        if rx(r'indoor', t):
            return f'birthday-venue:indoor'
        return f'birthday-venue:{seg}'
    if tp == 'things_to_do':
        if 'corporate_team_building' in c['occasions']:
            return 'events:corporate-team-building'
        if rx(r'adult|friends|date', t):
            return 'things-to-do:adults-groups'
        if rx(r'kid|family|child', t):
            return 'things-to-do:kids-family'
        return 'things-to-do:general-local'
    if tp == 'mall_navigational':
        return 'local:rockaway-townsquare-mall'
    return 'other:noise'

CLUSTER_TO_URL = {
    'brand:game-show-room': '/',
    'brand:sister-escape-rooms': '/escape-rooms-rockaway/',
    'game-show-birthday-party': '/birthday-parties/game-show-birthday-party/',
    'game-show:local': '/game-show-experience/',
    'game-show:generic-experience': '/game-show-experience/',
    'game-show:family-kids-school': '/group-events/school-and-youth-groups/',
    'game-show:corporate': '/group-events/corporate-team-building/',
    'events:corporate-team-building': '/group-events/corporate-team-building/',
    'escape-room:local': '/escape-rooms-rockaway/',
    'escape-room:generic': '/escape-rooms-rockaway/',
    'birthday-venue:kids': '/birthday-parties/kids/',
    'birthday-venue:indoor': '/birthday-parties/',
    'birthday-venue:general': '/birthday-parties/',
    'birthday-venue:teen': '/birthday-parties/teen-and-sweet-16/',
    'birthday-venue:adult': '/birthday-parties/adult/',
    'birthday-ideas:kids': '/blog/kids-birthday-party-ideas-morris-county/',
    'birthday-ideas:teen': '/blog/teen-birthday-party-ideas/',
    'birthday-ideas:adult': '/birthday-parties/adult/',
    'birthday-ideas:general': '/blog/kids-birthday-party-ideas-morris-county/',
    'things-to-do:adults-groups': '/things-to-do-rockaway-nj/',
    'things-to-do:kids-family': '/things-to-do-rockaway-nj/',
    'things-to-do:general-local': '/things-to-do-rockaway-nj/',
    'local:rockaway-townsquare-mall': '/visit/rockaway-townsquare/',
    'competitor:great big game show / american dream': '/compare/game-show-experiences-nj/',
    'competitor:game show battle rooms': '/game-show-experience/',
    'competitor:game show challenge (freehold)': '/compare/game-show-experiences-nj/',
}

rows = {}
def add(term, src, m):
    r = rows.setdefault(term, {'query': term, 'sources': set(), 'ppc': {'clicks': 0, 'cost': 0.0, 'impressions': 0, 'conversions': 0, 'campaigns': set(), 'excluded': False},
                               'gsc': None})
    r['sources'].add(src)
    if src == 'ppc':
        p = r['ppc']
        p['clicks'] += int(m['clicks']); p['cost'] += float(m['cost']); p['impressions'] += int(m['impr'])
        p['conversions'] += float(m['conv']); p['campaigns'].add(m['campaign']); p['excluded'] |= bool(m['excluded'])
    else:
        r['gsc'] = {'clicks': int(m['clicks']), 'impressions': int(m['impr']), 'ctr': m['ctr'], 'position': float(m['pos'])}

for _, m in ppc.iterrows():
    add(m['term'], 'ppc', m)
for _, m in gsc.iterrows():
    add(m['term'], 'gsc', m)

out = []
for t, r in rows.items():
    c = classify(t)
    cl = cluster(t, c)
    url = CLUSTER_TO_URL.get(cl)
    p = r['ppc']
    pri = c['commercial'] / 100
    vol = p['impressions'] + (r['gsc']['impressions'] if r['gsc'] else 0)
    priority = round(pri * (1 + min(vol, 1000) / 100) * (1.5 if len(r['sources']) == 2 else 1), 2)
    notes = []
    if p['cost'] >= 5 and p['conversions'] == 0:
        notes.append('spend with 0 recorded conversions (tracking gap - see ppc-strategy.md)')
    if c['other_geo'] and not c['towns']:
        notes.append('out-of-area geo modifier - negative candidate')
    if c['commercial'] <= 20:
        notes.append('low commercial intent / possible negative')
    if r['gsc'] and r['gsc']['impressions'] >= 30 and r['gsc']['position'] <= 15 and r['gsc']['clicks'] / max(r['gsc']['impressions'], 1) < 0.02:
        notes.append('GSC CTR opportunity (ranks <=15, CTR <2%)')
    out.append({
        'query': t, 'sources': sorted(r['sources']), 'intent': c['intent'], 'topic': c['topic'], 'cluster': cl,
        'occasions': c['occasions'], 'activities': c['activities'], 'location': c['towns'] or (['near me'] if c['near_me'] else []),
        'competitor': c['competitor'], 'commercial_intent': c['commercial'],
        'ppc': {'clicks': p['clicks'], 'cost': round(p['cost'], 2), 'impressions': p['impressions'], 'conversions': p['conversions'],
                'campaigns': sorted(p['campaigns']), 'excluded_in_account': p['excluded']} if 'ppc' in r['sources'] else None,
        'gsc': r['gsc'], 'recommended_url': url, 'page_status': 'built' if url else 'not targeted',
        'priority_score': priority, 'notes': notes,
    })
out.sort(key=lambda x: -x['priority_score'])
df = pd.DataFrame(out)

# --------------- aggregate reports ---------------
def agg(df, key):
    g = collections.defaultdict(lambda: dict(queries=0, ppc_clicks=0, ppc_cost=0.0, ppc_impr=0, gsc_clicks=0, gsc_impr=0, conv=0))
    for r in out:
        k = r[key]
        g[k]['queries'] += 1
        if r['ppc']:
            g[k]['ppc_clicks'] += r['ppc']['clicks']; g[k]['ppc_cost'] += r['ppc']['cost']; g[k]['ppc_impr'] += r['ppc']['impressions']; g[k]['conv'] += r['ppc']['conversions']
        if r['gsc']:
            g[k]['gsc_clicks'] += r['gsc']['clicks']; g[k]['gsc_impr'] += r['gsc']['impressions']
    res = []
    for k, v in g.items():
        v = dict(v); v['ppc_cost'] = round(v['ppc_cost'], 2)
        v['ppc_ctr'] = round(v['ppc_clicks'] / v['ppc_impr'] * 100, 2) if v['ppc_impr'] else None
        v['ppc_cpc'] = round(v['ppc_cost'] / v['ppc_clicks'], 2) if v['ppc_clicks'] else None
        res.append({key: k, **v})
    return sorted(res, key=lambda x: -(x['ppc_cost'] + x['gsc_impr'] / 10))

summary = {
    'generated': '2026-10-03',
    'ppc_date_range': 'Feb 1 2026 - Sep 30 2026 (8 months, per report header)',
    'gsc_date_range': 'not included in export (no date column); assumed ~6 months per brief',
    'ppc_totals_reported': {'birthday': {'clicks': 3035, 'cost': 4226.32, 'impressions': 65496, 'conversions': 0,
                                         'note': 'incl. 1,549 clicks / $2,158.39 in "Other search terms" hidden by Google'},
                            'game_show': {'clicks': 251, 'cost': 266.69, 'impressions': 1706, 'conversions': 0,
                                          'note': 'incl. 132 clicks / $120.82 in "Other search terms"'}},
    'gsc_totals': {'clicks': 266, 'impressions': 9289, 'mobile_share_clicks': round(160 / 266, 3), 'us_share_impr': round(8975 / 9289, 3)},
    'unique_queries': len(out),
    'by_intent': agg(df, 'intent'),
    'by_cluster': agg(df, 'cluster'),
    'by_topic': agg(df, 'topic'),
}
competitor_spend = [x for x in summary['by_cluster'] if x['cluster'].startswith('competitor:')]

# occasions / ages
occ_c = collections.Counter(); occ_cost = collections.Counter()
age_c = collections.Counter()
for r in out:
    for o in r['occasions']:
        occ_c[o] += 1
        if r['ppc']: occ_cost[o] += r['ppc']['cost']
    m = re.findall(r'\b(\d{1,2})(?:st|nd|rd|th)?\s*(?:year|yr|birthday|bday)', r['query'])
    for a in m:
        if 1 <= int(a) <= 100: age_c[int(a)] += (r['ppc']['impressions'] if r['ppc'] else 0) + (r['gsc']['impressions'] if r['gsc'] else 0)
summary['occasions'] = [{'occasion': k, 'queries': v, 'ppc_cost': round(occ_cost[k], 2)} for k, v in occ_c.most_common()]
summary['age_mentions_by_impressions'] = sorted([{'age': k, 'impressions': v} for k, v in age_c.items()], key=lambda x: -x['impressions'])[:25]
towns = collections.Counter()
for r in out:
    for t in r['location']:
        towns[t] += (r['ppc']['impressions'] if r['ppc'] else 0) + (r['gsc']['impressions'] if r['gsc'] else 0)
summary['geo_modifiers_by_impressions'] = towns.most_common(25)

# Top spend non-converting & negatives
ppc_rows = [r for r in out if r['ppc']]
summary['top_spend_terms'] = [{'query': r['query'], 'cost': r['ppc']['cost'], 'clicks': r['ppc']['clicks'], 'impr': r['ppc']['impressions'], 'intent': r['intent'], 'cluster': r['cluster']}
                              for r in sorted(ppc_rows, key=lambda r: -r['ppc']['cost'])[:40]]
summary['high_impr_low_ctr'] = [{'query': r['query'], 'impr': r['ppc']['impressions'], 'clicks': r['ppc']['clicks'], 'ctr': round(r['ppc']['clicks'] / r['ppc']['impressions'] * 100, 2), 'cluster': r['cluster']}
                                for r in sorted(ppc_rows, key=lambda r: -r['ppc']['impressions']) if r['ppc']['impressions'] >= 100 and r['ppc']['clicks'] / r['ppc']['impressions'] < 0.03][:30]
summary['high_ctr_terms'] = [{'query': r['query'], 'impr': r['ppc']['impressions'], 'clicks': r['ppc']['clicks'], 'ctr': round(r['ppc']['clicks'] / r['ppc']['impressions'] * 100, 1), 'cost': r['ppc']['cost']}
                             for r in sorted(ppc_rows, key=lambda r: -(r['ppc']['clicks'])) if r['ppc']['impressions'] >= 15 and r['ppc']['clicks'] / r['ppc']['impressions'] >= 0.10][:30]
neg = [r for r in ppc_rows if r['ppc']['cost'] > 0 and (r['commercial_intent'] <= 30)]
summary['negative_candidates'] = [{'query': r['query'], 'cost': r['ppc']['cost'], 'clicks': r['ppc']['clicks'], 'reason': '; '.join(r['notes']) or r['intent'] + ' / ' + r['cluster']}
                                  for r in sorted(neg, key=lambda r: -r['ppc']['cost'])[:60]]
summary['negative_candidate_spend'] = round(sum(r['ppc']['cost'] for r in neg), 2)
summary['competitor_clusters'] = competitor_spend
# n-grams in PPC by cost
ng = collections.Counter(); ngi = collections.Counter()
for r in ppc_rows:
    w = r['query'].split()
    for n in (1, 2):
        for i in range(len(w) - n + 1):
            g = ' '.join(w[i:i + n])
            ng[g] += r['ppc']['cost']; ngi[g] += r['ppc']['impressions']
summary['ppc_ngrams_by_cost'] = [{'ngram': k, 'cost': round(v, 2), 'impr': ngi[k]} for k, v in ng.most_common(60)]
# overlap
both = [r for r in out if len(r['sources']) == 2]
summary['ppc_gsc_overlap'] = [{'query': r['query'], 'ppc_cost': r['ppc']['cost'], 'ppc_clicks': r['ppc']['clicks'], 'gsc_impr': r['gsc']['impressions'], 'gsc_clicks': r['gsc']['clicks'], 'gsc_pos': r['gsc']['position']} for r in sorted(both, key=lambda r: -r['ppc']['cost'])]
summary['gsc_ctr_opportunities'] = [{'query': r['query'], **r['gsc'], 'cluster': r['cluster']} for r in out if r['gsc'] and r['gsc']['impressions'] >= 20 and r['gsc']['clicks'] / r['gsc']['impressions'] < 0.03]
summary['gsc_ctr_opportunities'].sort(key=lambda x: -x['impressions'])

json.dump(summary, open(os.path.join(PRIV, 'summary.json'), 'w'), indent=1, default=list)
json.dump(out, open(os.path.join(PRIV, 'search-intelligence-full.json'), 'w'), indent=1, default=list)
print('unique', len(out))
for k in ['by_intent', 'by_topic']:
    print(k); [print(' ', x) for x in summary[k]]
print('clusters'); [print(' ', x) for x in summary['by_cluster'][:45]]
print('occ', summary['occasions']); print('ages', summary['age_mentions_by_impressions'][:15]); print('geo', summary['geo_modifiers_by_impressions'])
print('neg spend', summary['negative_candidate_spend'])
print('overlap', summary['ppc_gsc_overlap'][:20])
print('ngrams', summary['ppc_ngrams_by_cost'][:40])
print('hictr', summary['high_ctr_terms'][:20])
