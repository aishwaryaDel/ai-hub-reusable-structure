# Constants Migration Summary

## Overview
All hardcoded values have been extracted from the codebase into a centralized `constants/constants.ts` file for better maintainability.

## New Structure

### Location
- Primary constants file: `src/constants/constants.ts`
- Barrel export: `src/constants/index.ts`

### Exported Constants

#### 1. **DEPARTMENTS**
- Type: `readonly ['Marketing', 'R&D', 'Procurement', 'IT', 'HR', 'Operations']`
- Usage: Department selection dropdowns, filtering, display

#### 2. **STATUS_SEQUENCE**
- Type: `readonly ['Ideation', 'Pre-Evaluation', 'Evaluation', 'PoC', 'MVP', 'Live', 'Archived']`
- Usage: Status progression, filtering, status validation

#### 3. **LANGUAGES**
- Type: `readonly ['en', 'de']`
- Usage: Language selection, i18n

#### 4. **DEFAULT_LANGUAGE**
- Value: `'de'`
- Usage: Initial language setting

#### 5. **STATUS_COLORS**
- Type: `Record<UseCaseStatus, string>`
- Usage: Status badge styling

#### 6. **DEFAULT_IMAGES**
- Type: `Record<Department, string>`
- Usage: Fallback images for use case cards

#### 7. **VALIDATION**
- Contains: email regex, URL regex, max length constraints
- Usage: Form validation throughout the app

#### 8. **UI**
- Contains: pagination settings, animation config, breakpoints
- Usage: UI configuration

## Migration Changes

### Updated Files

1. **src/components/NewUseCaseModal.tsx**
   - Replaced local `departments` and `statusSequence` arrays
   - Now imports from `constants/constants`

2. **src/pages/UseCaseOverview.tsx**
   - Replaced local `departments` and `statuses` arrays
   - Now imports from `constants/constants`

3. **src/components/UseCaseCard.tsx**
   - Replaced `constants.defaultImages` and `constants.statusColors`
   - Now imports directly from `constants/constants`

4. **src/components/UseCaseDetailModal.tsx**
   - Replaced local `stages` array and config imports
   - Now imports from `constants/constants`

5. **src/contexts/LanguageContext.tsx**
   - Replaced hardcoded default language
   - Now uses `DEFAULT_LANGUAGE` constant

6. **src/types/index.ts**
   - Exports `Department` and `UseCaseStatus` types from constants
   - Maintains single source of truth

7. **src/config/index.ts**
   - Updated to import and re-export constants
   - Added deprecation notices for old imports

## Benefits

1. **Single Source of Truth**: All constants defined in one place
2. **Type Safety**: Exported types ensure consistency across the app
3. **Easier Maintenance**: Update values in one location
4. **Better Testing**: Constants can be mocked or overridden
5. **Improved Discoverability**: Developers know where to find constants

## Usage Examples

```typescript
// Import specific constants
import { DEPARTMENTS, STATUS_COLORS, Department } from '../constants/constants';

// Use in component
const departmentList = DEPARTMENTS;
const statusColor = STATUS_COLORS[status];

// Type usage
const department: Department = 'IT';
```

## Backward Compatibility

The `config/index.ts` file still exports constants for backward compatibility but includes deprecation notices. New code should import directly from `constants/constants.ts`.

## Testing

All 38 tests pass successfully after the migration.
Build completes without errors.
