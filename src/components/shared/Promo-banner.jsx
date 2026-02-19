import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function PromoBanner() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
      <div className="relative overflow-hidden rounded-3xl bg-primary">
        <div className="flex flex-col items-center lg:flex-row">
          <div className="flex flex-1 flex-col items-center gap-5 px-8 py-14 text-center lg:items-start lg:px-16 lg:text-left">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground/70">
              Limited Time Offer
            </span>
            <h2 className="font-serif text-3xl font-bold text-primary-foreground sm:text-4xl text-balance">
              Up to 40% Off
              <br />
              Winter Essentials
            </h2>
            <p className="max-w-sm text-sm leading-relaxed text-primary-foreground/80">
              Explore our curated selection of winter must-haves. Premium quality
              at exceptional prices, available for a limited time only.
            </p>
            <Button
              asChild
              variant="secondary"
              size="lg"
              className="rounded-xl px-8"
            >
              <Link href="/products?sale=true">
                Shop the Sale
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          </div>
          <div className="relative hidden h-80 flex-1 lg:block">
            <Image
              src="/promo-banner.jpg"
              alt="Winter essentials sale featuring premium fashion items"
              fill
              className="object-cover"
              sizes="50vw"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
