import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import QuestionAndAnswer from './QuestionAndAnswer'
import './FAQsContent.css'

const faqsList: {question: string, answer: React.ReactNode}[] = [
    {   
        question: "Are you a 501(c)(3) organization?",
        answer:(
        <>
            <br/>
            <p>Yes! The Donovan&apos;s Venom, INC. 501(c)(3) was established 2014 and became a 501(c)(3) organization in 2020.</p>
            <br/>
            <p>Our Employer Identification Number (EIN) is 27-3996051.</p>
        </>)},
    {   
        question: `Why are you called “The Donovan's Venom”?`,
        answer: (
            <>
                <br/>
                <p>The Donovan is our founder.</p>
                <br/>
                <p>The name “Venom” is often associated with negativity and harm, but we have chosen to repurpose the name to represent something positive. In our organization, “Venom” represents the power and strength that can be harnessed for good. The best thing about venom is that it&apos;s INFECTIOUS! We believe that everyone has the potential to make a positive impact on the world, and we are committed to empowering individuals to use their own “venom” to create change.</p><br/>
                <p>By using “venom” in a positive context, we can help to change these negative perceptions and promote a message of community and empowerment.</p>
            </>
    )},
    {
        question: "How can I receive free music lessons?",
        answer: (
        <>
            <br/>
            <p>All qualifying and permitted applicants are eligible to receive scholarships for music lessons.</p><br/>
            <p>You can apply for a scholarship by filling out our <Link href='https://docs.google.com/forms/d/e/1FAIpQLSczYBC5tnRZcjjTBN4J4BXEDxO-8NuM1ZuNlfR4z9heXk3T6w/viewform' className='text-primary-blue underline'>intake form</Link></p>
        </>
    )},
    {
        question: "Are there income requirements to receive services and scholarships from The Donovan's Venom?",
        answer: (
            <>
                <br/>
                <p>Families and participants who meet the Federal Poverty Level (FPL) qualify for our full scholarships and services.  Please refer to the chart below.</p><br/>
                <table className='w-full text-left'>
                    <thead className='bg-[#FCF0D8]'>
                        <tr>
                            <th className='py-5 px-2 font-semibold'>Family size</th>
                            <th className='font-semibold'>2021 income number</th>
                            <th className='font-semibold'>2022 income number</th>
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-[#BDB4A2]'>
                        <tr>
                            <td className='py-5 px-2'>For individuals</td>
                            <td>$12,880</td>
                            <td>$13,590</td>
                        </tr>
                        <tr>
                            <td className='py-5 px-2'>For a family of 2</td>
                            <td>$17,420</td>
                            <td>$18,310</td>
                        </tr>
                        <tr>
                            <td className='py-5 px-2'>For a family of 3</td>
                            <td>$21,960</td>
                            <td>$23,030</td>
                        </tr>
                        <tr>
                            <td className='border-b border-[#BDB4A2] py-5 px-2'>For a family of 4</td>
                            <td className='border-b border-[#BDB4A2]'>$26,500</td>
                            <td className='border-b border-[#BDB4A2]'>$27,750</td>
                        </tr>
                    </tbody>
                </table>
            </>
    )},
    { 
        question: "Are there age restrictions or requirements to receive services and scholarships from The Donovan's Venom?",
        answer: (
        <>
            <br/>
            <p>The Donovan&apos;s Venom, INC. 501(c)(3) services our community with vigor. Our primary focus is to service underserved and underprivileged youth aged 21 and below. We also would like to focus on the often-forgotten seniors aged 60 and older who are within the parameters of the Federal Poverty Line (FPL). </p>
        </>
    )},
    {
        question: "What if I make more money than the listed requirement?",
        answer: (
        <>
            <br/>
            <p>We want to service our entire community. Thank goodness you are fortunate enough to have access beyond the Federal Poverty Line. We are still able to service you, and you still may be eligible for a scholarship provided by our organization for services and music education. Please contact us for more information.</p>
        </>
    )},
    {
        question: "Are there fees for the music lessons?",
        answer: (
        <>
            <br/>
            <p>Families and participants who meet the Federal Poverty Level (FPL) requirement will qualify for our full scholarships and services. There will be NO FEES for such participants.</p>
        </>
    )},
    {
        question: "What things can I learn if I participate?",
        answer: (
        <>
            <br/>
            <p>All students can choose to take classes in the following:</p><br/>
            <ul className='list-disc ml-10'>
                <li>Piano</li>
                <li>Guitar</li>
                <li>Vocals</li>
                <li>Sight reading</li>
                <li>Music theory</li>
            </ul>
        </>
    )},
    {
        question: "How are the classes taught?",
        answer: (
        <>
            <br/>
            <p>The classes are taught in a group setting. Individual lessons may be available, depending on the availability of our staff.</p><br/>
            <p>We give both in-person and virtual classes based on the location of each student.</p>
        </>
    )},
    {
        question: "What is the toy giveaway and how can I participate as a recipient?",
        answer: (
        <>
            <br/>
            <p>The Donovan&apos;s Venom  does an annual toy giveaway every year during the holiday season. Those who wish to receive toys for their families should complete an RSVP form before the deadline. Benefits from our events are always given on a first come, first served basis and while supplies last. Our giveaways are open to the public. Take a look at our toy giveaway in 2022 <Link href='https://www.youtube.com/watch?v=qUicXlzMtmA' className='text-primary-blue underline'>here</Link>.</p>
        </>
    )},
    {
        question: "Can I donate to your organization?",
        answer: (
        <>
            <br/>
            <p>Thank you for your generosity! We currently accept donations via our <Link href='https://www.paypal.com/donate/?hosted_button_id=3HAXBG4AGR83Y' className='text-primary-blue underline'>Paypal page</Link>. Paypal will ensure that your sensitive information is protected. On the payment page, you can choose the area to which you would like your money to go.</p><br/>
            <p>If you wish to donate via another method, please contact us to arrange your donation.</p>
        </>
    )},
    {
        question: "How will my donations be used?",
        answer: (
        <>
            <br/>
            <p>You can choose on our Paypal portal the area in which you would like to donate. The funds we raise go directly towards our programs and initiatives that support families in need.
            </p><br/>
            <ul className='list-disc ml-10'>
                <li>The funds raised from our <strong>annual toy giveaway</strong> go towards purchasing toys and gifts for underprivileged families.</li>
                <li>The funds raised from our <strong>benefit concerts</strong> and performances go towards organizing more events and programs that can be enjoyed by all, especially those who normally can&apos;t afford to attend them.
                </li>
                <li>All book sales from the Piano Room go towards scholarships for young students. The scholarships provide financial assistance to deserving students who may not have the means to pursue their educational goals.
                </li>
            </ul><br/>
            <p>Some portions may be used to cover other expenses, such as fees for our website or video equipment for our events. We try to keep our overhead as low as possible to ensure that the majority of the proceeds go towards making a positive impact in the community.</p>
        </>
    )},
    {
        question: "Can I become a sponsor?",
        answer: (
        <>
            <br/>
            <p>Yes! We welcome sponsors at many of our events. Please contact us to discuss more about working with our organization.</p>
        </>
    )},
    {
        question: "What is AmazonSmile and how can we use it to help you?",
        answer: (
        <>
            <br/>
            <p>AmazonSmile is a simple way for you to support The Donovan&apos;s Venom every time you shop, at no cost to you. AmazonSmile is available at <Link href='https://www.amazon.com/?ref_=smi_se_saas_lsmi_smi' className='text-primary-blue underline'>smile.amazon.com</Link> on your web browser and can be activated in the Amazon Shopping app for iOS and Android phones. Please register and use us as your charity today!</p>
        </>
    )},
    {
        question: "Can I help purchase something directly for The Donovan's Venom?",
        answer: (
        <>
            <br/>
            <p>Yes! Instead of donating, we also welcome your help with purchasing items from our <Link href='https://www.amazon.com/hz/wishlist/ls/4I8C4CTHFCUR?ref_=wl_share' className='text-primary-blue underline'>Amazon Wishlist</Link>. The wishlist contains items to help fund the promotion of The Donovan&apos;s Venom so we can continue serving. We also have items to give to the underprivileged in community. Thank you for your help!</p>
        </>
    )},
    {
        question: "How can I volunteer?",
        answer: (<div><br/>
        <p>Thank you so much for your interest in volunteering! As a nonprofit organization, we wouldn&apos;t be able to serve the community without your help.</p><br/>
        <p>You can find open volunteer positions on our <Link href='https://www.volunteermatch.org/search/org1183807.jsp' className='text-primary-blue underline'>VolunteerMatch page</Link>. If there is a position that fits your area of interest, please let us know. We would love to talk with you!</p>
    </div>
    )},
    {
        question: "Can I receive community service hours as a volunteer?",
        answer: (
        <>
            <br/>
            <p>Yes! The Donovan&apos;s Venom will happily accommodate, moderate, and satisfy community service hours if you need them.</p>
        </>
    )},
    {
        question: "What is the President's Volunteer Service Award?",
        answer: (
        <>
            <br/>
            <p>The President&apos;s Volunteer Service Award is a civil award bestowed by the President of the United States. We will happily supply, moderate, and satisfy volunteer hours that are calculated towards achieving The President&apos;s Volunteer Service Award. Please contact us if you need help with this.</p>
        </>
    )}
];

export default function FAQsContent() {
  return (
    <div className='flex flex-col items-center justify-center h-full overflow-auto'>
        <div className='h-[82%] w-[90%]'>
            <h4 className='text-secondary-brown text-6xl 3xl:text-7xl 4xl:text-8xl font-semibold font-montserrat font-medium text-center'>Your questions, answered.</h4>
            <div className='flex justify-between w-full mt-6'>
                <div className='w-full select-none'>
                    {faqsList.map((item, i) => (
                        <QuestionAndAnswer question={item.question} key={i}>
                            {item.answer}
                        </QuestionAndAnswer>
                    ))}
                </div>
                <div>
                    <div className='bg-[#FCF0D8] p-7 rounded-2xl w-[230px]'>
                        <Image className='mb-4' src='/about/FAQs/CatImage.svg' alt='' width={90} height={90}/>
                        <p className='font-semibold text-[13px] mb-4 text-gray-800'>Still got questions? Reach out!</p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    
  )
}
