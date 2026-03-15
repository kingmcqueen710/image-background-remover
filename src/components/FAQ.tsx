const FAQ_ITEMS = [
  {
    q: 'Is this background remover really free?',
    a: 'Yes, completely free. No signup or credit card required. You can process up to 10 images per hour.',
  },
  {
    q: 'What image formats are supported?',
    a: 'We support JPG, PNG, and WEBP files up to 10 MB.',
  },
  {
    q: 'How accurate is the AI background removal?',
    a: 'Our AI handles most subjects well — people, products, animals, and objects. Results may vary on very complex or low-contrast backgrounds.',
  },
  {
    q: 'Are my images stored or shared?',
    a: 'No. Your images are processed in real time and immediately discarded. We never store or share your photos.',
  },
  {
    q: 'Can I use the results commercially?',
    a: 'Yes. You own the output. Use it for e-commerce listings, marketing materials, or any other purpose.',
  },
  {
    q: 'What resolution will the downloaded image be?',
    a: 'The free version outputs up to 1000 px on the longest side in PNG format with a transparent background.',
  },
]

export default function FAQ() {
  return (
    <section className="mt-20">
      <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
        Frequently Asked Questions
      </h2>
      <div className="space-y-3 max-w-3xl mx-auto">
        {FAQ_ITEMS.map((item) => (
          <div key={item.q} className="bg-white rounded-xl p-5 border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-1.5">{item.q}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{item.a}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
