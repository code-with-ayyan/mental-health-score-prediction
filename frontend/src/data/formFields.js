// Single source of truth for the twelve fields accepted by the FastAPI `DataModel`.
// `name` values and option `value` strings must match the backend exactly.

const toOptions = (values, labels = {}) =>
  values.map((value) => ({ value, label: labels[value] ?? value }));

export const FIELD_GROUPS = [
  {
    id: 'demographic',
    title: 'Demographic information',
    description: 'Basic background details about you.',
    icon: 'user',
    columns: 2,
    fields: [
      {
        name: 'age',
        label: 'Age',
        control: 'integer',
        min: 10,
        max: 100,
        unit: 'years',
        placeholder: 'For example, 22',
        description: 'Enter a whole number between 10 and 100.',
      },
      {
        name: 'gender',
        label: 'Gender',
        control: 'segmented',
        options: toOptions(['Male', 'Female']),
        description: 'Choose one of the two options the model accepts.',
      },
      {
        name: 'grouped_country',
        label: 'Country',
        control: 'select',
        placeholder: 'Select your country',
        options: toOptions(
          [
            'India', 'USA', 'Canada', 'Australia', 'UK', 'Germany', 'Turkey', 'Mexico',
            'France', 'Spain', 'Ireland', 'Japan', 'Denmark', 'Switzerland', 'Other',
          ],
          { Other: 'Other country' },
        ),
        description: 'Countries that are not listed belong under "Other country".',
      },
      {
        name: 'academic_level',
        label: 'Academic level',
        control: 'select',
        placeholder: 'Select your academic level',
        options: toOptions(['Undergraduate', 'Graduate', 'High School']),
        description: 'Your current level of study.',
      },
    ],
  },
  {
    id: 'digital',
    title: 'Social media habits',
    description: 'How you use social media and your phone on a typical day.',
    icon: 'smartphone',
    columns: 2,
    fields: [
      {
        name: 'most_used_platform',
        label: 'Most used social media platform',
        control: 'select',
        placeholder: 'Select a platform',
        options: toOptions([
          'Facebook', 'LinkedIn', 'Instagram', 'Snapchat', 'Twitter', 'YouTube',
          'TikTok', 'LINE', 'KakaoTalk', 'VKontakte', 'WhatsApp', 'WeChat',
        ]),
        description: 'The platform where you spend the most time.',
      },
      {
        name: 'purpose_of_use',
        label: 'Primary purpose of social media use',
        control: 'select',
        placeholder: 'Select a purpose',
        options: toOptions(['Networking', 'Education', 'Entertainment', 'News']),
        description: 'The main reason you use social media.',
      },
      {
        name: 'avg_daily_usage_hours',
        countsTowardDay: true,
        label: 'Average daily social media usage',
        control: 'decimal',
        min: 0,
        max: 24,
        step: 0.1,
        unit: 'hours',
        placeholder: 'For example, 6.5',
        description: 'Hours per day, from 0 to 24. Decimals such as 2.5 are allowed.',
      },
      {
        name: 'daily_unlocks',
        label: 'Daily phone unlocks',
        control: 'integer',
        min: 0,
        unit: 'unlocks',
        placeholder: 'For example, 85',
        description: 'Approximately how many times you unlock your phone each day.',
      },
    ],
  },
  {
    id: 'wellbeing',
    title: 'Lifestyle and wellbeing',
    description: 'Study, movement, sleep and stress on a typical day.',
    icon: 'heart',
    columns: 3,
    fields: [
      {
        name: 'study_hours',
        countsTowardDay: true,
        label: 'Daily study hours',
        control: 'decimal',
        min: 0,
        max: 24,
        step: 0.1,
        unit: 'hours',
        placeholder: 'For example, 5',
        description: 'Hours per day, from 0 to 24.',
      },
      {
        name: 'physical_activity_hours',
        countsTowardDay: true,
        label: 'Daily physical activity',
        control: 'decimal',
        min: 0,
        max: 24,
        step: 0.1,
        unit: 'hours',
        placeholder: 'For example, 1',
        description: 'Hours of exercise or movement per day.',
      },
      {
        name: 'sleep_hours_per_night',
        countsTowardDay: true,
        label: 'Average sleep per night',
        control: 'decimal',
        min: 0,
        max: 24,
        step: 0.1,
        unit: 'hours',
        placeholder: 'For example, 7',
        description: 'Hours of sleep per night, from 0 to 24.',
      },
      {
        name: 'stress_level',
        label: 'Perceived stress level',
        control: 'segmented',
        wide: true,
        // Display order runs from lowest to highest; submitted values are unchanged.
        options: toOptions(['Low', 'Medium', 'High', 'Very High']),
        description: 'How stressed you generally feel. This is your own perception.',
      },
    ],
  },
];

export const FIELDS = FIELD_GROUPS.flatMap((group) => group.fields);

export const INITIAL_VALUES = Object.fromEntries(FIELDS.map((field) => [field.name, '']));
