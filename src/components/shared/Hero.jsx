import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'

function Hero() {
    return (
        <section className='relative overflow-hidden bg-secondary'>
            <div className='mx-auto flex max-w-7xl flex-col-reverse
             items-center px-4 py-16 lg:flex-row lg:px-6 lg:py-24'>
                <div className='flex flex-1 flex-col items-center gap-6 text-center lg:items-start lg:text-left
                '>
                    <span className='text-xs font-semibold uppercase tracking-[0.2rem] text-muted-foreground'>
                        New Season Collection
                    </span>
                    <h1 className='font-serif text-4xl font-bold leading-tight
                    tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance'>
                        Elevate Your
                        <br />
                        Everyday Style
                    </h1>
                    <p className='max-w-md text-base leading-relaxed text-muted-foreground text-pretty'> Discover thoughtfully curated pieces designed for modern living.
                        Premium quality, timeless design.</p>
                    <div className='flex items-center gap-3'>
                        <Button asChild size='lg' className='rounded-xl px-8 '>
                            <Link href='/products'>
                                Shop Now
                                <ArrowRight className='ml-2 size-4' />
                            </Link>
                        </Button>
                        <Button asChild variant="outline"
                            size="lg" className="rounded-xl px-8">
                            <Link href='/products?sort=newest'>
                                New Arrivals
                            </Link>
                        </Button>

                    </div>
                </div>

                    <div className='relative aspect-4/3 w-full max-w-lg
                     overflow-hidden rounded-3xl lg:max-w-xl'>
                        <Image
                            src="/hero-banner.jpg"
                            alt="Premium lifestyle products arranged on a neutral background"
                            fill
                            className="object-cover"
                            priority
                            sizes="(max-width: 1024px) 100vw, 50vw" />
                    </div>
              
            </div>
        </section>
    )
}

export default Hero


