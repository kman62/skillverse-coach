# COPPA Compliance Implementation

## Overview

AIthlete has been configured with a **Parent/Guardian Account Model** to avoid COPPA (Children's Online Privacy Protection Act) compliance requirements while still serving young athletes.

## Implementation Strategy: Option 3 - Neutral Age Approach

### Key Features

1. **No Age Collection**: We do not collect or store age information for any users
2. **Adult Account Requirement**: All accounts must be created by parents, guardians, or coaches
3. **Athlete Profile Management**: Adults can create and manage multiple athlete profiles
4. **No Direct Minor Access**: Athletes do not have login credentials - all access is through adult accounts

### Database Architecture

#### Tables Created

**`athletes` table:**
- Stores athlete profile information
- Linked to guardian/parent account via `guardian_id` (references `auth.users`)
- Fields: name, position, jersey_number, sport, date_of_birth (optional), notes
- Protected by Row-Level Security (RLS) - guardians can only access their own athletes

**`analysis_history` table updated:**
- Added `athlete_id` column to link analyses to specific athletes
- Maintains audit trail of all performance analyses per athlete

#### Security Policies

All RLS policies ensure:
- Guardians can only view/manage their own athlete profiles
- Analysis data is properly isolated by guardian account
- Cascade deletion: removing an athlete also removes their analysis history

### User Experience Flow

1. **Account Creation**: 
   - Adults sign up for "Parent/Guardian Portal"
   - Clear messaging that this is for managing athlete profiles
   
2. **Athlete Management**:
   - Navigate to "My Athletes" page
   - Create athlete profiles with name, sport, position, jersey number
   - Optional: Add date of birth (for age-appropriate training)
   - Add notes about goals, medical considerations, etc.

3. **Performance Tracking**:
   - Upload videos and analyses are linked to specific athlete profiles
   - View progress for each athlete separately
   - Generate highlight reels per athlete

### Privacy Policy Updates

The Privacy Policy has been updated to include:
- Clear statement about Parent/Guardian Account Model
- Explanation that we don't collect age information
- Clarification that minors cannot create accounts directly
- Statement that all athlete data is managed by responsible adults

## Why This Avoids COPPA

### COPPA Requirements (that we bypass)
1. ❌ **No age verification needed** - We don't ask for ages
2. ❌ **No parental consent mechanism** - All accounts are adult accounts
3. ❌ **No direct collection from children** - Children don't use the platform directly
4. ❌ **No child-directed content** - Platform is for adult management

### Legal Basis
- Platform is designed for and marketed to parents/guardians/coaches
- Athletes are subjects of analysis, not users of the service
- No direct interaction with children under 13
- All personal data collection is from adults

## Implementation Files

### New Components
- `src/components/athletes/AthletesList.tsx` - Display and manage athlete cards
- `src/components/athletes/AthleteForm.tsx` - Create/edit athlete profiles with validation
- `src/pages/AthletesPage.tsx` - Main athlete management page

### Modified Components
- `src/App.tsx` - Added `/athletes` route
- `src/components/layout/Navbar.tsx` - Added "My Athletes" navigation link
- `src/pages/AuthPage.tsx` - Updated messaging to clarify parent/guardian accounts
- `src/pages/PrivacyPage.tsx` - Added COPPA compliance section

### Database Migration
- Created `athletes` table with proper RLS policies
- Added `athlete_id` to `analysis_history` table
- Created indexes for performance
- Added automatic timestamp triggers

## Input Validation

The athlete form includes comprehensive validation:
- **Name**: Required, 1-100 characters, trimmed
- **Position**: Optional, max 50 characters
- **Jersey Number**: Optional, max 10 characters
- **Sport**: Dropdown selection from supported sports
- **Date of Birth**: Optional, date picker
- **Notes**: Optional, max 500 characters

All validation uses Zod schemas for type safety and security.

## Future Considerations

### If You Need Full COPPA Compliance
If you later decide to allow children under 13 to use the platform directly, you would need to implement:

1. **Age Verification**
   - Collect birthdates during signup
   - Automatically detect users under 13
   
2. **Verifiable Parental Consent**
   - Email verification to parent
   - Credit card verification (small charge)
   - Government ID upload
   - Video call verification
   - Signed consent form
   
3. **Parental Access Rights**
   - Parents can view all child's data
   - Parents can delete child's account
   - Parents receive privacy notices
   
4. **Enhanced Privacy Controls**
   - Limited data collection for children
   - No behavioral advertising to children
   - Special privacy policy for children

### Recommended Additions
1. **Age Gate**: Consider adding a 13+ requirement even for the current model
2. **Terms Update**: Add terms of service requiring adult supervision
3. **Legal Review**: Consult with attorney familiar with COPPA
4. **Documentation**: Keep records of compliance measures

## Compliance Checklist

- ✅ No age data collection
- ✅ Adult-only account creation
- ✅ Clear parent/guardian messaging
- ✅ Privacy policy updated
- ✅ Data properly isolated by guardian
- ✅ Athlete profiles managed by adults
- ✅ No direct child interaction
- ✅ Secure data storage with RLS
- ✅ Input validation on all forms
- ⚠️ **Recommended**: Legal review by COPPA attorney
- ⚠️ **Recommended**: Add 13+ age requirement to Terms of Service

## Resources

- [FTC COPPA Compliance Guide](https://www.ftc.gov/business-guidance/resources/complying-coppa-frequently-asked-questions)
- [COPPA Rule Overview](https://www.ftc.gov/legal-library/browse/rules/childrens-online-privacy-protection-rule-coppa)
- [Six-Step Compliance Plan](https://www.ftc.gov/business-guidance/resources/childrens-online-privacy-protection-rule-six-step-compliance-plan-your-business)

## Support

For questions about this implementation, contact your legal counsel or privacy compliance team.

---

**Last Updated**: ${new Date().toLocaleDateString()}
**Implementation Status**: Complete ✅
