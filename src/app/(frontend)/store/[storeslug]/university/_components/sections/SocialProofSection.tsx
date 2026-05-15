import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import type { StatItem, Review, ActivityFeedItem } from '../../event.config';

interface SocialProofSectionProps {
  stats: StatItem[]
  testimonials: Review[]
  activityFeed: ActivityFeedItem[]
}

export default function SocialProofSection({ stats, testimonials, activityFeed }: SocialProofSectionProps) {
  const half = Math.ceil(activityFeed.length / 2);
  const feedLeft = activityFeed.slice(0, half);
  const feedRight = activityFeed.slice(half);

  return (
    <section className="py-24 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12 space-y-3">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Join the <span className="text-amber-300">Musical Community</span>
          </h2>
          <p className="text-amber-200 text-lg">
            May 28–31, 2026 • Limited Appointment Slots Available
          </p>
          <p className="text-slate-300 max-w-3xl mx-auto">
            Be part of Houston&apos;s exclusive piano community with TCU-endorsed expert guidance and premium instrument selection
          </p>
        </div>

        {/* Community Metrics Grid - Clean */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-white/10 border-white/20 text-center">
              <CardContent className="pt-6">
                <div className="text-4xl font-bold text-amber-300 mb-2">{stat.value}</div>
                <div className="text-white text-sm font-medium mb-1">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Live Activity Feed - Clean */}
        <div className="max-w-4xl mx-auto mb-12">
          <Card className="bg-white/10 border-white/20">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-white font-semibold">Recent Activity</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3 text-white/90 text-sm">
                  {feedLeft.map((item, index) => (
                    <div key={index} className="flex justify-between">
                      <span>{item.name} {item.action}</span>
                      <span className="text-amber-300 text-xs">{item.timeAgo}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 text-white/90 text-sm">
                  {feedRight.map((item, index) => (
                    <div key={index} className="flex justify-between">
                      <span>{item.name} {item.action}</span>
                      <span className="text-amber-300 text-xs">{item.timeAgo}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Customer Reviews - Clean */}
        <div className="max-w-5xl mx-auto mb-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-4">What Our Community Says</h3>
            <div className="flex items-center justify-center space-x-4 mb-6">
              <span className="text-2xl font-bold text-amber-300">4.9</span>
              <span className="text-white/80">/5 on Google</span>
              <span className="text-white/60">•</span>
              <span className="text-white/80">847 verified reviews</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((review, index) => (
              <Card key={index} className="bg-white/10 border-white/20">
                <CardContent className="pt-6">
                  <div className="h-20 bg-gray-200 rounded mb-4 flex items-center justify-center">
                    <span className="text-gray-500 text-xs">Customer Photo</span>
                  </div>
                  <blockquote className="text-white/90 text-sm mb-4">&ldquo;{review.text}&rdquo;</blockquote>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white font-medium text-sm">{review.name}</div>
                      <div className="text-white/60 text-xs">{review.location}</div>
                    </div>
                    <div className="text-white/50 text-xs">{review.timeAgo}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Final CTA Section - Clean */}
        <div className="text-center">
          <Card className="bg-white/10 border-white/20 max-w-3xl mx-auto">
            <CardContent className="pt-8">
              <h3 className="text-white text-2xl font-bold mb-4">Reserve Your Exclusive Access</h3>
              <p className="text-white/90 mb-6">Join hundreds of satisfied Houston families in the TCU piano community</p>
              
              <Button size="lg" className="bg-kawai-red hover:bg-kawai-red-dark text-white font-bold text-lg px-12 py-4 mb-6">
                BOOK YOUR CONSULTATION NOW
              </Button>
              
              <div className="grid sm:grid-cols-3 gap-4 text-sm text-white/90">
                <span>Free 30-min consultation</span>
                <span>No pressure environment</span>
                <span>30-day price guarantee</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}