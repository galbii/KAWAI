import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Guarantee } from '../../event.config';

interface AuthorityTrustSectionProps {
  quote: { text: string; author: string; role: string }
  guarantees: Guarantee[]
}

export default function AuthorityTrustSection({ quote, guarantees }: AuthorityTrustSectionProps) {
  return (
    <section className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-full px-4 py-2">
            <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xs">TCU</span>
            </div>
            <span className="text-amber-800 font-medium text-sm">Official Partnership</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Trusted by <span className="text-kawai-red">Music Professionals</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Our exclusive partnership with Texas Christian University Music Department brings you institutional credibility and expert-approved piano selections.
          </p>
        </div>

        {/* Testimonial & Credentials */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* TCU Endorsement */}
          <Card className="p-6">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">TCU</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Music Department Chair</h3>
                  <p className="text-sm text-amber-600">Texas Christian University</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <blockquote className="text-muted-foreground italic mb-4">
                &ldquo;{quote.text}&rdquo;
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-muted rounded-full"></div>
                <div>
                  <div className="font-medium text-sm">{quote.author}</div>
                  <div className="text-xs text-muted-foreground">{quote.role}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Guarantees */}
          <Card className="p-6">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Quality Guarantees</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {guarantees.map((guarantee, index) => (
                <div key={index} className="flex gap-3">
                  <div className="w-8 h-8 bg-kawai-red rounded flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{guarantee.title}</h4>
                    <p className="text-xs text-muted-foreground">{guarantee.description}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}