import { Brain, ClipboardList, GraduationCap, HeartPulse, LineChart, Smartphone, User } from 'lucide-react';

const STEPS = [
  {
    icon: ClipboardList,
    title: 'Share your information',
    text: 'You answer twelve questions about your background, social media habits, study, movement, sleep and stress.',
  },
  {
    icon: Brain,
    title: 'The trained pipeline processes it',
    text: 'Your answers are sent to a prediction service that runs a previously trained machine learning pipeline on them.',
  },
  {
    icon: LineChart,
    title: 'You receive an estimate',
    text: 'The service returns one number. It is shown with a short explanation and a summary of what you entered.',
  },
];

const FEATURE_GROUPS = [
  { icon: User, title: 'Demographic information', items: ['Age', 'Gender', 'Country', 'Academic level'] },
  {
    icon: Smartphone,
    title: 'Social media habits',
    items: ['Most used platform', 'Primary purpose of use', 'Average daily usage', 'Daily phone unlocks'],
  },
  {
    icon: HeartPulse,
    title: 'Lifestyle and wellbeing',
    items: ['Daily study hours', 'Daily physical activity', 'Average sleep per night', 'Perceived stress level'],
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" aria-labelledby="how-heading" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-14 sm:px-6">
      <h2 id="how-heading" className="text-3xl font-bold sm:text-4xl">
        How it works
      </h2>
      <ol className="mt-8 grid gap-4 md:grid-cols-3">
        {STEPS.map(({ icon: Icon, title, text }, index) => (
          <li key={title} className="card p-6">
            <div className="flex items-center gap-3">
              <span className="inline-flex size-10 items-center justify-center rounded-xl bg-accent/15 text-accent-soft">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <span className="text-sm font-medium text-fg-subtle">Step {index + 1}</span>
            </div>
            <h3 className="mt-4 text-lg font-semibold">{title}</h3>
            <p className="mt-2 leading-relaxed text-fg-muted">{text}</p>
          </li>
        ))}
      </ol>

      <h3 className="mt-14 text-2xl font-semibold">Features considered</h3>
      <p className="mt-2 max-w-2xl text-fg-muted">The model accepts exactly these twelve inputs, grouped here by type.</p>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {FEATURE_GROUPS.map(({ icon: Icon, title, items }) => (
          <div key={title} className="card p-6">
            <div className="flex items-center gap-3">
              <Icon className="size-5 text-accent-soft" aria-hidden="true" />
              <h4 className="font-display text-lg font-semibold">{title}</h4>
            </div>
            <ul className="mt-4 space-y-2 text-fg-muted">
              {items.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-accent-soft" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
