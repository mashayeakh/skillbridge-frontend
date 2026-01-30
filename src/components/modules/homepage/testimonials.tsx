import { dummyTutor } from "@/data/dummyTutor";
import {
    Card,
    CardContent,
} from "@/components/ui/card";

const colors = [
    "bg-rose-50 border-rose-100",
    "bg-emerald-50 border-emerald-100",
    "bg-sky-50 border-sky-100",
    "bg-amber-50 border-amber-100",
    "bg-violet-50 border-violet-100",
    "bg-pink-50 border-pink-100",
];

export default function TestimonialPage() {
    return (
        <section className="py-12 md:py-16 bg-[#F7F2ED]">
            <div className="container mx-auto px-6 ">
                <div className="text-center mb-8 md:mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold">What Our Clients Say</h2>
                    <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
                        Discover how our customers are using our products to build their
                        businesses
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {dummyTutor.slice(0, 6).map((tutor, i) => (
                        <Card
                            key={tutor.id}
                            className={`rounded-xl overflow-hidden border p-0 ${colors[i % colors.length]} shadow-sm`}
                        >
                            <CardContent className="p-6">
                                <div className="flex items-start gap-6">
                                    <div className="flex-shrink-0">
                                        <div className="h-20 w-20 rounded-full overflow-hidden ring-4 ring-white shadow">
                                            <img
                                                src={tutor.image.src}
                                                alt={tutor.image.alt}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex-1">
                                        <div className="mb-2">
                                            <h3 className="text-base font-semibold">{tutor.name}</h3>
                                            <div className="text-xs text-muted-foreground">{tutor.role}</div>
                                        </div>

                                        <p className="text-sm leading-relaxed text-muted-foreground">
                                            “{tutor.quote}”
                                        </p>

                                        <div className="mt-4">
                                            <span className="text-sm font-semibold text-primary">Voice Tutor</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}

