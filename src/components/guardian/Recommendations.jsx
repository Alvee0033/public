import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const recommendations = [
  {
    title: "Extra Math Practice",
    description: "Based on recent test scores, we recommend additional focus on Algebra.",
    action: "Schedule Session",
  },
  {
    title: "Reading Challenge",
    description: "Encourage your child to participate in our monthly reading challenge.",
    action: "Learn More",
  },
  {
    title: "Science Fair Preparation",
    description: "The annual science fair is coming up. Start brainstorming project ideas!",
    action: "Get Ideas",
  },
]

export function Recommendations() {
  return (
    (<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {recommendations.map((rec, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle>{rec.title}</CardTitle>
            <CardDescription>{rec.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button>{rec.action}</Button>
          </CardContent>
        </Card>
      ))}
    </div>)
  );
}

