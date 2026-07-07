import { Button } from "../common/Button";
import { Card } from "../common/Card";

type CompanyActionCardProps = {
  icon: "job-post" | "assignment";
  title: string;
  description: string;
  items: string[];
  buttonLabel: string;
  href: string;
};

export function CompanyActionCard({
  icon,
  title,
  description,
  items,
  buttonLabel,
  href
}: CompanyActionCardProps) {
  return (
    <Card className="wd-action-card">
      <div className={`wd-action-card__icon wd-action-card__icon--${icon}`} aria-hidden="true" />
      <h3>{title}</h3>
      <p>{description}</p>
      <ul className="wd-action-card__list">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <Button href={href} fullWidth>
        {buttonLabel}
        <span className="wd-inline-icon wd-inline-icon--arrow-right" aria-hidden="true" />
      </Button>
    </Card>
  );
}
