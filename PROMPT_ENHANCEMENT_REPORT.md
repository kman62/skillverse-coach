# AIthlete Prompt Enhancement Report

## Executive Summary
This report documents the integration of the Complete Performance framework prompts into AIthlete and identifies prompts requiring new functionality for future implementation.

## ✅ Implemented Prompts

### 1. Enhanced Clip Analysis (`analyze-clip` edge function)
- **Prompt ID**: `offense_performance_v1` / `defense_performance_v1` (combined)
- **Status**: ✅ Implemented
- **Changes**: 
  - Updated to use Complete Performance framework
  - Added structured phase-by-phase technical analysis
  - Integrated all 6 intangible metrics with evidence and ratings
  - Added synthesis section connecting intangibles to technical performance
- **File**: `supabase/functions/analyze-clip/index.ts`

### 2. Enhanced Feedback Generation (`generate-feedback` edge function)
- **Prompt ID**: `parent_summary_v1` + enhanced athlete feedback
- **Status**: ✅ Implemented
- **Changes**:
  - Restructured athlete feedback with tangibles, intangibles snapshot, and development focus
  - Enhanced parent feedback with simple language, intangible development explanation, and support suggestions
  - Integrated Complete Performance framework terminology
- **File**: `supabase/functions/generate-feedback/index.ts`

---

## 🔨 Prompts Requiring New Functionality

### Category 1: Contextual Analysis Prompts
These require the ability to detect specific game situations.

#### 1. Transition Offense Analysis
- **Prompt ID**: `transition_offense_v1`
- **Required Features**:
  - Automatic detection of transition possessions (2v1, 3v2, etc.)
  - Floor balance and lane-running tracking
  - Advantage state recognition
- **Use Case**: Analyzing fast-break situations and pace play
- **Priority**: High
- **Estimated Effort**: Medium (requires possession-type classification)

#### 2. Transition Defense Analysis  
- **Prompt ID**: `transition_defense_v1`
- **Required Features**:
  - Detection of possession changes and sprint-back behavior
  - Route tracking and assignment recognition
  - Numerical advantage/disadvantage calculation
- **Use Case**: Evaluating defensive hustle and transition discipline
- **Priority**: High
- **Estimated Effort**: Medium

#### 3. Pick-and-Roll Coverage Breakdown
- **Prompt ID**: `pick_and_roll_v1`
- **Required Features**:
  - Screen action detection
  - Coverage type identification (drop, hedge, switch, ICE, etc.)
  - Role assignment (ball-handler, screener, on-ball defender, etc.)
- **Use Case**: Detailed PnR offensive and defensive analysis
- **Priority**: Medium-High
- **Estimated Effort**: High (complex multi-player action tracking)

---

### Category 2: Skill-Focused Deep-Dive Prompts
These require focused analysis of specific skills rather than full possessions.

#### 4. Ball-Handling Breakdown
- **Prompt ID**: `ball_handling_v1`
- **Required Features**:
  - Isolated ball-handling sequence extraction
  - Dribble move classification (crossover, hesitation, spin, etc.)
  - Pressure context detection
- **Use Case**: Detailed guard skill development
- **Priority**: Medium
- **Estimated Effort**: Medium
- **Implementation Path**: Could be a separate analysis mode or post-processing filter

#### 5. Shooting Form Breakdown
- **Prompt ID**: `shooting_form_v1`
- **Required Features**:
  - Shot attempt isolation
  - Mechanics breakdown (base, load, release, follow-through)
  - Shot-type classification (catch-and-shoot, off-dribble, etc.)
  - Contest level detection
- **Use Case**: Shooting coach-level mechanical analysis
- **Priority**: Medium-High
- **Estimated Effort**: Medium
- **Implementation Path**: Could integrate with existing shot detection

#### 6. Decision-Making Engine
- **Prompt ID**: `decision_making_v1`
- **Required Features**:
  - Decision-point timestamping
  - Available options detection (pass targets, drive lanes, shot availability)
  - Choice vs. optimal choice comparison
- **Use Case**: Basketball IQ and tactical development
- **Priority**: High
- **Estimated Effort**: High (requires sophisticated scene understanding)

---

### Category 3: Multi-Clip & Aggregation Prompts
These require batch processing and longitudinal analysis.

#### 7. Player Development Summary
- **Prompt ID**: `player_development_summary_v1`
- **Required Features**:
  - Multi-clip aggregation dashboard
  - Trend analysis across clips
  - 4-week development plan generation
- **Use Case**: Season-long development tracking
- **Priority**: Medium
- **Estimated Effort**: Medium
- **Implementation Path**: 
  - New page/component for multi-clip selection
  - Aggregate analysis edge function
  - Development plan storage and tracking

#### 8. Multi-Clip Batch Summary (JSON)
- **Prompt ID**: `multi_clip_batch_v1`
- **Required Features**:
  - Batch processing of multiple clips
  - Consistent strength/weakness extraction across clips
  - Structured JSON output
- **Use Case**: Automated highlight reel metadata generation
- **Priority**: High (enables better highlight reel features)
- **Estimated Effort**: Low-Medium (mostly backend edge function work)
- **Implementation Path**: New edge function `analyze-batch` that processes arrays of clips

#### 9. Intangible Profile Aggregator
- **Prompt ID**: `intangible_aggregator_v1`
- **Required Features**:
  - Database storage of per-clip intangible ratings
  - Time-series aggregation
  - Trend visualization
  - Focus area identification
- **Use Case**: Long-term player development tracking
- **Priority**: Medium-High
- **Estimated Effort**: Medium-High
- **Implementation Path**:
  - Database schema update to store intangible ratings separately
  - New `aggregate-intangibles` edge function
  - Dashboard visualization component

---

### Category 4: Structured Output Prompts
These are variations for system-to-system integration.

#### 10. JSON Offense/Defense Analysis
- **Prompt ID**: `json_off_def_analysis_v1`
- **Required Features**:
  - Strict JSON schema enforcement
  - No additional functionality needed
- **Use Case**: API integrations, mobile apps, third-party tools
- **Priority**: Low (current implementation already returns structured data)
- **Estimated Effort**: Low (prompt refinement only)
- **Implementation Path**: Add as optional output format to existing `analyze-clip`

#### 11. Highlight Extraction (JSON)
- **Prompt ID**: `highlight_extraction_v1`
- **Required Features**:
  - Moment classification (scoring, defensive, hustle, playmaking, intangible)
  - Timestamp extraction
  - Automatic highlight categorization
- **Use Case**: Auto-generating highlight reels from game film
- **Priority**: High (major feature enabler)
- **Estimated Effort**: Medium
- **Implementation Path**: New `extract-highlights` edge function

---

### Category 5: Meta/System Prompts

#### 12. Internal Prompt Generator
- **Prompt ID**: `prompt_generator_internal_v1`
- **Required Features**:
  - Not user-facing
  - Internal tool for AIthlete team to generate sport/age-specific prompts
- **Use Case**: Scaling to new sports, age groups, and analysis types
- **Priority**: Low (internal tooling)
- **Estimated Effort**: Low
- **Implementation Path**: Admin-only tool or script

---

## 📊 Implementation Priority Matrix

| Priority | Prompts | Estimated Total Effort |
|----------|---------|------------------------|
| **High** | Transition Offense, Transition Defense, Multi-Clip Batch, Highlight Extraction, Decision-Making | High |
| **Medium-High** | Pick-and-Roll, Shooting Form, Intangible Aggregator | High |
| **Medium** | Ball-Handling, Player Development Summary | Medium |
| **Low** | JSON Output Format, Prompt Generator | Low |

---

## 🎯 Recommended Implementation Phases

### Phase 1: Multi-Clip Infrastructure (2-3 weeks)
**Goal**: Enable batch analysis and aggregation
- [ ] Implement `multi_clip_batch_v1` edge function
- [ ] Implement `intangible_aggregator_v1` with database schema updates
- [ ] Create multi-clip selection UI
- [ ] Build aggregated intangible dashboard

**Business Value**: Unlocks longitudinal player development tracking and better highlight reel generation

---

### Phase 2: Contextual Situation Detection (3-4 weeks)
**Goal**: Automatically detect and analyze specific game situations
- [ ] Implement transition detection (offense + defense)
- [ ] Implement pick-and-roll detection
- [ ] Add situation-specific analysis prompts
- [ ] Create situation filter in analysis history

**Business Value**: Provides coaches with situation-specific insights without manual tagging

---

### Phase 3: Skill Deep-Dive Tools (2-3 weeks)
**Goal**: Enable focused skill analysis
- [ ] Implement ball-handling analysis mode
- [ ] Implement shooting form breakdown
- [ ] Implement decision-making engine
- [ ] Create skill-focused analysis views

**Business Value**: Positions AIthlete as a skill development platform, not just game analysis

---

### Phase 4: Highlight Auto-Generation (2 weeks)
**Goal**: Automatically extract and categorize highlights
- [ ] Implement `highlight_extraction_v1`
- [ ] Build auto-highlight reel generation
- [ ] Add highlight type filters
- [ ] Create shareable highlight packages

**Business Value**: Major differentiation feature for recruiting and showcasing

---

## 🔧 Technical Requirements Summary

### New Database Tables Needed
```sql
-- Store individual intangible ratings per clip
CREATE TABLE intangible_ratings (
  id UUID PRIMARY KEY,
  analysis_id UUID REFERENCES analysis_history(id),
  metric_name TEXT NOT NULL, -- courage, composure, initiative, etc.
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  evidence TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Store highlights extracted from clips
CREATE TABLE extracted_highlights (
  id UUID PRIMARY KEY,
  analysis_id UUID REFERENCES analysis_history(id),
  highlight_type TEXT NOT NULL, -- scoring, defensive, hustle, playmaking, intangible
  time_range TEXT,
  description TEXT,
  coaching_note TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Store aggregated player profiles
CREATE TABLE player_intangible_profiles (
  id UUID PRIMARY KEY,
  athlete_id UUID REFERENCES athletes(id),
  sport TEXT NOT NULL,
  date_range_start DATE,
  date_range_end DATE,
  courage_avg DECIMAL,
  composure_avg DECIMAL,
  initiative_avg DECIMAL,
  leadership_avg DECIMAL,
  stress_effectiveness_avg DECIMAL,
  resilience_avg DECIMAL,
  primary_focus TEXT,
  secondary_focus TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### New Edge Functions Needed
1. `analyze-batch` - Process multiple clips in one request
2. `aggregate-intangibles` - Compute player intangible profiles over time
3. `extract-highlights` - Auto-identify highlight moments
4. `analyze-transition` - Transition-specific analysis
5. `analyze-pickandroll` - PnR-specific analysis
6. `analyze-skill-focus` - Deep-dive skill analysis (ball-handling, shooting, etc.)

---

## 💡 Recommendations

1. **Start with Phase 1 (Multi-Clip Infrastructure)** - This unlocks the most value with moderate effort and enables better use of existing analyses.

2. **Prioritize Highlight Auto-Generation (Phase 4)** early if recruiting showcase is a core value prop.

3. **Defer situation detection (Phase 2)** until you have stronger computer vision capabilities or can partner with a CV provider.

4. **Consider building skill deep-dives (Phase 3) as premium features** to create product differentiation and justify higher pricing tiers.

5. **Sport Expansion**: The prompt library provided is basketball-focused. Before implementing these features, create equivalent prompt libraries for:
   - Baseball
   - Football  
   - Soccer
   - Volleyball
   - Tennis
   - Golf
   - Rugby

---

## 📝 Next Steps

1. **Review and prioritize** this report with product and engineering teams
2. **Validate business value** of each phase with target users (coaches, parents, athletes)
3. **Assign ownership** for each implementation phase
4. **Create detailed technical specs** for Phase 1
5. **Begin sport-specific prompt library development** for non-basketball sports

---

*Report Generated: 2025*  
*Framework: Complete Performance (6 Intangibles)*  
*Current Implementation: Enhanced clip analysis + Enhanced feedback generation*
