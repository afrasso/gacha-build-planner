import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getArtifactMetricDisplay, getHelpMessages } from "@/constants/messages";
import { ArtifactMetric } from "@/types";

const RATING_METRICS = [ArtifactMetric.RATING, ArtifactMetric.PLUS_MINUS, ArtifactMetric.POSITIVE_PLUS_MINUS_ODDS];

const BUILD_COMPLETION_METRICS = [
  ArtifactMetric.CURRENT_STATS_CURRENT_ARTIFACTS,
  ArtifactMetric.CURRENT_STATS_RANDOM_ARTIFACTS,
  ArtifactMetric.DESIRED_STATS_CURRENT_ARTIFACTS,
  ArtifactMetric.DESIRED_STATS_RANDOM_ARTIFACTS,
];

const HelpContent: React.FC = () => {
  const help = getHelpMessages();

  const gettingStartedItems = [
    help.gettingStarted.builds,
    help.gettingStarted.artifacts,
    help.gettingStarted.importExport,
    help.gettingStarted.cloudSync,
    help.gettingStarted.recalculatingMetrics,
  ];

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8 space-y-10">
      <div className="space-y-3">
        <h1 className="text-4xl font-bold">{help.title}</h1>
        <p className="text-lg text-muted-foreground">{help.intro}</p>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{help.gettingStarted.title}</h2>
        <Accordion className="w-full" collapsible type="single">
          {gettingStartedItems.map((item) => (
            <AccordionItem key={item.title} value={item.title}>
              <AccordionTrigger>{item.title}</AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground">{item.body}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{help.metrics.title}</h2>
        <p className="text-muted-foreground">{help.metricsIntro}</p>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">Rating metrics</h3>
          <p className="text-sm text-muted-foreground">{help.metrics.ratingMetricsIntro}</p>
          <Accordion className="w-full" collapsible type="single">
            {RATING_METRICS.map((metric) => {
              const display = getArtifactMetricDisplay(metric);
              return (
                <AccordionItem key={metric} value={metric}>
                  <AccordionTrigger>{display.label}</AccordionTrigger>
                  <AccordionContent className="space-y-2">
                    <p className="text-muted-foreground">{display.description}</p>
                    <p>
                      <span className="font-medium">When to use it: </span>
                      {display.whenToUse}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">Build completion metrics</h3>
          <p className="text-sm text-muted-foreground">{help.metrics.satisfactionMetricsIntro}</p>
          <Accordion className="w-full" collapsible type="single">
            {BUILD_COMPLETION_METRICS.map((metric) => {
              const display = getArtifactMetricDisplay(metric);
              return (
                <AccordionItem key={metric} value={metric}>
                  <AccordionTrigger>{display.label}</AccordionTrigger>
                  <AccordionContent className="space-y-2">
                    <p className="text-muted-foreground">{display.description}</p>
                    <p>
                      <span className="font-medium">When to use it: </span>
                      {display.whenToUse}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-2xl font-semibold">Where you see metrics</h2>
        <p className="text-muted-foreground">{help.whereYouSeeMetrics}</p>
      </section>
    </div>
  );
};

export default HelpContent;
