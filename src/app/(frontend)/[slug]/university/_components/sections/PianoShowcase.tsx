import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { pianos } from '../data/pianos';

export default function PianoShowcase() {
  return (
    <section id="featured-deals" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <Badge variant="outline" className="mb-2">
            Limited Inventory: Only 48 Premium Pianos Available
          </Badge>
          
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Featured <span className="text-kawai-red">Piano Sale</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Specially negotiated pricing through our TSU partnership &ndash; unavailable elsewhere
          </p>
        </div>

        {/* Piano Inventory */}
        <div className="grid gap-6">
          {pianos.map((piano, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Piano Image and Info */}
                <div className="lg:col-span-1">
                  <div className="h-48 bg-muted overflow-hidden rounded-t-lg relative">
                    <Image
                      src={piano.image}
                      alt={piano.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-xs">{piano.badge}</Badge>
                      <Badge variant="secondary" className="text-xs">{piano.category}</Badge>
                    </div>
                    <CardTitle className="text-lg">{piano.name}</CardTitle>
                    <CardDescription className="text-sm">Model: {piano.model}</CardDescription>
                  </CardHeader>
                </div>

                {/* Pricing */}
                <div className="lg:col-span-1">
                  <CardContent className="pt-6">
                    <div className="text-center space-y-3">
                      <div>
                        <div className="text-sm text-muted-foreground line-through">Was: {piano.originalPrice}</div>
                        <div className="text-3xl font-bold text-kawai-red">{piano.price}</div>
                        <div className="text-base font-semibold text-green-600">Save {piano.savings}</div>
                      </div>
                      
                      <div className="border-t pt-3">
                        <div className="text-sm text-muted-foreground">Or pay monthly:</div>
                        <div className="text-lg font-semibold">{piano.monthlyPayment}/month</div>
                      </div>

                      <div className="text-sm text-muted-foreground">
                        {piano.remaining} remaining
                      </div>
                    </div>
                  </CardContent>
                </div>

                {/* Features and CTAs */}
                <div className="lg:col-span-1">
                  <CardContent className="pt-6">
                    <div className="space-y-3 mb-6">
                      {piano.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="text-sm text-muted-foreground">
                          {feature}
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <Button className="w-full bg-kawai-red hover:bg-kawai-red-dark" size="sm">
                        Add to Consultation
                      </Button>
                      <Button variant="outline" className="w-full" size="sm">
                        Learn More
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Value Proposition */}
        <div className="mt-12">
          <Card className="p-6">
            <CardHeader className="pb-4">
              <CardTitle className="text-center text-xl">What&apos;s Included with Every Piano</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4 text-center">
                <div>
                  <h4 className="font-medium mb-1">10-Year Warranty</h4>
                  <p className="text-sm text-muted-foreground">Comprehensive coverage</p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Free Delivery</h4>
                  <p className="text-sm text-muted-foreground">Within 50 miles</p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Professional Setup</h4>
                  <p className="text-sm text-muted-foreground">Expert installation</p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">30-Day Guarantee</h4>
                  <p className="text-sm text-muted-foreground">Satisfaction promise</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}