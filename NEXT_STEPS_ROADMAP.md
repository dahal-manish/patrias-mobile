# Mobile App Development Roadmap
## Next Steps to Achieve Feature Parity with Web Version

### Current State Analysis

#### ✅ **Mobile MVP (Completed)**
- Basic authentication (login/signup)
- 10-question practice sessions
- Basic progress tracking (overall stats, recent sessions, category performance)
- Daily reminder notifications
- Progress syncing with database

#### 🌐 **Web Version Features (Reference)**
- **5 Study Modules**: Civics, Flashcards, Practice Test, Verbal Practice, Mock Interview
- **Advanced Analytics**: Module performance, study time tracking, detailed charts
- **User Profile/Settings**: Bank version selection, senior eligibility, language preferences
- **Smart Features**: Intelligent grading, dynamic questions, bank versioning (2008/2025)

---

## 🎯 Recommended Implementation Order

### **Phase 1: Core Study Modules** (High Priority)
*These are the most impactful features that users will use daily*

#### 1.1 Flashcards Module
**Priority**: ⭐⭐⭐⭐⭐ (Highest)
- **Why**: Most requested feature, great for quick study sessions
- **Features Needed**:
  - Question/Answer flip cards
  - Confidence level tracking (Know it / Kind of know it / Don't know it)
  - Progress through all questions
  - Shuffle option
  - Integration with existing progress tracking
- **Estimated Effort**: 2-3 days
- **API Endpoint**: `/api/flashcards-questions` (already exists)

#### 1.2 Practice Test Module
**Priority**: ⭐⭐⭐⭐
- **Why**: Timed test simulation is crucial for exam preparation
- **Features Needed**:
  - 10-question timed test (10 minutes)
  - Free response input (not multiple choice)
  - Timer countdown
  - Pass/fail threshold (60%)
  - Results summary with category breakdown
  - Intelligent answer grading
- **Estimated Effort**: 3-4 days
- **API Endpoint**: `/api/practice-test-questions` (already exists)

#### 1.3 Enhanced Civics Practice
**Priority**: ⭐⭐⭐⭐
- **Why**: Current practice is basic; web has intelligent matching
- **Features Needed**:
  - Free response input option
  - Intelligent answer matching (semantic grading)
  - Better feedback on answers
  - Question bank indicator (2008 vs 2025)
- **Estimated Effort**: 2-3 days

---

### **Phase 2: User Profile & Settings** (Medium-High Priority)
*Essential for personalization and proper question bank selection*

#### 2.1 Settings Screen
**Priority**: ⭐⭐⭐⭐
- **Why**: Users need to manage their profile and test bank version
- **Features Needed**:
  - Profile information (name, email, native language, ESL level)
  - Date of birth (for senior eligibility)
  - State of residence
  - N-400 filing date
  - Civics bank version selector (2008/2025)
  - Senior eligibility indicator
- **Estimated Effort**: 2-3 days
- **API**: Profile updates via Supabase

#### 2.2 Bank Version Support
**Priority**: ⭐⭐⭐⭐
- **Why**: Critical for showing correct question set (100 vs 128 questions)
- **Features Needed**:
  - Auto-detect bank based on N-400 filing date
  - Manual override option
  - Display current bank version in UI
  - Filter questions by bank version
- **Estimated Effort**: 1-2 days
- **API Endpoint**: `/api/user/bank-info` (already exists)

---

### **Phase 3: Advanced Analytics** (Medium Priority)
*Enhance the progress screen with more detailed insights*

#### 3.1 Enhanced Analytics Dashboard
**Priority**: ⭐⭐⭐
- **Why**: Better insights motivate users and show progress
- **Features Needed**:
  - Study time tracking
  - Module performance breakdown (per practice mode)
  - Weekly/monthly progress charts
  - Weak area identification
  - Improvement trends
  - Readiness score
- **Estimated Effort**: 3-4 days
- **API Endpoint**: `/api/analytics` (already exists)

#### 3.2 Study Time Tracking
**Priority**: ⭐⭐⭐
- **Why**: Track engagement and study habits
- **Features Needed**:
  - Track time spent per session
  - Daily/weekly study time totals
  - Display in analytics
- **Estimated Effort**: 1-2 days

---

### **Phase 4: Advanced Study Modules** (Lower Priority)
*These require more complex implementations*

#### 4.1 Verbal Practice / Pronunciation
**Priority**: ⭐⭐
- **Why**: Great for ESL learners, but requires speech recognition
- **Features Needed**:
  - Voice input recording
  - Speech-to-text transcription
  - Intelligent answer grading
  - Pronunciation feedback
- **Estimated Effort**: 5-7 days
- **Dependencies**: Speech recognition API, TTS integration
- **API Endpoints**: `/api/stt`, `/api/tts` (already exist)

#### 4.2 Mock Interview
**Priority**: ⭐⭐
- **Why**: Realistic interview simulation, but complex
- **Features Needed**:
  - Voice-moderated interview flow
  - AI interviewer simulation
  - 10-question interview
  - Pass/fail results
- **Estimated Effort**: 7-10 days
- **Dependencies**: Speech recognition, complex state management

---

## 📊 Implementation Priority Matrix

### **Must Have (Next 2-3 Weeks)**
1. ✅ Flashcards Module
2. ✅ Practice Test Module  
3. ✅ Settings Screen
4. ✅ Bank Version Support

### **Should Have (Next Month)**
5. Enhanced Analytics Dashboard
6. Study Time Tracking
7. Enhanced Civics Practice

### **Nice to Have (Future)**
8. Verbal Practice
9. Mock Interview

---

## 🛠️ Technical Considerations

### **Shared Infrastructure**
- ✅ Database schema already supports all features
- ✅ API endpoints exist for most features
- ✅ Progress tracking infrastructure in place
- ✅ Authentication working

### **Mobile-Specific Needs**
- Navigation structure for new screens
- Mobile-optimized UI components
- Offline support (future consideration)
- Push notifications for achievements (future)

### **Integration Points**
- Use existing `/api/save-attempt` for all practice modes
- Leverage existing analytics hooks
- Reuse progress context where possible
- Follow existing code patterns

---

## 📝 Next Immediate Steps

1. **Start with Flashcards Module** - Highest user value, moderate complexity
2. **Add Settings Screen** - Enables bank version support
3. **Implement Bank Version Logic** - Critical for correct question sets
4. **Add Practice Test Module** - High value for exam prep
5. **Enhance Analytics** - Better user insights

---

## 🎯 Success Metrics

After Phase 1 & 2 completion:
- ✅ Users can study with flashcards
- ✅ Users can take timed practice tests
- ✅ Users can manage their profile and test bank
- ✅ Mobile app has 80% feature parity with web

After Phase 3 completion:
- Users have detailed progress insights
- Mobile app has 90% feature parity with web

---

## 💡 Recommendations

**Start with Flashcards** because:
1. High user value
2. Moderate complexity (2-3 days)
3. Uses existing infrastructure
4. Immediate impact on user experience
5. Good foundation for other modules

**Then Settings** because:
1. Unlocks bank version support
2. Enables proper personalization
3. Required for accurate question sets
4. Relatively straightforward implementation

**Then Practice Test** because:
1. Critical for exam preparation
2. Differentiates from basic practice
3. High user engagement
4. Uses intelligent grading (already built)

---

## 📚 Reference Files

### Web Implementation References
- Flashcards: `patrias-web/app/study/flashcards/page.tsx`
- Practice Test: `patrias-web/app/practice/quiz/page.tsx`
- Settings: `patrias-web/app/settings/page.tsx`
- Analytics: `patrias-web/components/analytics-dashboard.tsx`
- Bank Selector: `patrias-web/components/civics-bank-selector.tsx`

### Mobile Current State
- Practice: `patrias-mobile/app/(app)/practice.tsx`
- Progress: `patrias-mobile/app/(app)/progress.tsx`
- Home: `patrias-mobile/app/(app)/home.tsx`

---

*Last Updated: Based on current codebase analysis*
*Next Review: After Phase 1 completion*

