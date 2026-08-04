'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface ReviewItem {
  author: string;
  role: string;
  rating: number;
  text: string;
  avatarInitials: string;
  avatarBg: string;
}

interface AttractionDetailData {
  id: string;
  name: string;
  region: string;
  score: number;
  readinessPct: number;
  readinessText: string;
  rating: number;
  reviewsCount: string;
  categories: string[];
  descriptionTitle: string;
  paragraphs: string[];
  desktopHeroImage: string;
  mobileHeroImage: string;
  price: string;
  priceUnit: string;
  momoSupported: boolean;
  lowSignal: boolean;
  familyFriendly: boolean;
  proTips: {
    eat: string;
    wear: string;
  };
  etiquette: {
    quote: string;
    items: string[];
  };
  reviews: ReviewItem[];
  mapImage: string;
  locationText: string;
  phone: string;
  estimatedTravel: string;
}

interface AttractionDetailProps {
  id?: string;
}

const ATTRACTIONS_DETAIL_DATA: Record<string, AttractionDetailData> = {
  'cape-coast-castle': {
    id: 'cape-coast-castle',
    name: 'Cape Coast Castle',
    region: 'Central Region',
    score: 9.2,
    readinessPct: 98,
    readinessText: 'Excellent',
    rating: 4.9,
    reviewsCount: '2.4k Reviews',
    categories: ['Heritage', 'Museum', 'Coastal'],
    descriptionTitle: 'A Monument to Human History',
    paragraphs: [
      "Cape Coast Castle is one of about forty 'slave castles', or large commercial forts, built on the Gold Coast of West Africa by European traders. Originally built by the Swedes for the trade in timber and gold, it was later used in the transatlantic slave trade.",
      "Visitors can explore the dark underground dungeons where enslaved people were held before passing through the infamous 'Door of No Return'. Today, the castle stands as a powerful historical museum and educational monument."
    ],
    desktopHeroImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8O36nF3FQWEV3q1ubMPQTfowJJrgnOkE2VDBE1fGjhEwz55wzqmWE5c69TFC7vFp_rw_KvMMKZ5mKV_fkGRMTKCfuVRc9MgUkc8hTCiv5vKuRdf_1ljdxmxhoHLGno6Vh9r6_Qi5ClZqNv0KQM9yu_Mscw4UjEXe6wm-0aFD0Ap24OYhdwYVfaTOLJhNn9TMbmBiMZ897X6p9eHD2MbWjX_PRh32dQFQBLPeSb9BfN6NSYS57z_EM6R7-jIQ4pLJwklvEJ0X5H3JQ',
    mobileHeroImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8O36nF3FQWEV3q1ubMPQTfowJJrgnOkE2VDBE1fGjhEwz55wzqmWE5c69TFC7vFp_rw_KvMMKZ5mKV_fkGRMTKCfuVRc9MgUkc8hTCiv5vKuRdf_1ljdxmxhoHLGno6Vh9r6_Qi5ClZqNv0KQM9yu_Mscw4UjEXe6wm-0aFD0Ap24OYhdwYVfaTOLJhNn9TMbmBiMZ897X6p9eHD2MbWjX_PRh32dQFQBLPeSb9BfN6NSYS57z_EM6R7-jIQ4pLJwklvEJ0X5H3JQ',
    price: 'GHS 40',
    priceUnit: '/ person',
    momoSupported: true,
    lowSignal: false,
    familyFriendly: true,
    proTips: {
      eat: 'Try fresh lobster and grilled tilapia at the seaside restaurants right next to the castle.',
      wear: 'Cool clothing and comfortable walking shoes. A hat and sunscreen are highly recommended.'
    },
    etiquette: {
      quote: 'Honoring the Memory of the Past.',
      items: [
        'Respect the silence in the dungeons',
        'No flash photography in certain museum sections'
      ]
    },
    reviews: [
      {
        author: 'Ama Osei',
        role: 'Verified Local Traveler',
        rating: 5,
        text: 'A very emotional and educational experience. The tour guides are exceptionally knowledgeable and handle the history with great respect.',
        avatarInitials: 'AO',
        avatarBg: 'bg-primary-fixed'
      },
      {
        author: 'David Miller',
        role: 'Verified International Traveler',
        rating: 5,
        text: 'Moving and historical. Standing in the dungeons and walking through the Door of No Return is something I will never forget.',
        avatarInitials: 'DM',
        avatarBg: 'bg-secondary-fixed'
      }
    ],
    mapImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBMQQXhk7MffwE2M0ZjaYktbftVUlRQ-RsEwq6gxwZhXw9jFPhOvV4y7Vi8IwQ4NVjVDw0ABIyCtPIV3-GoZoLjYNb-cKluwu2dAlL22paGO8Q1BPGsENqFqTIti6yxezx9w4IzhKcLXhhP6r3PW6_VsXCfUVb6J7YWgfkx29Lir1SB02KDnxiKV7rjReyJpGfw7Rcjz7HKF1Og3CuQf4mAIJ2MDztOho-I7diL_BeNsSBOhZbhTx3A8Nw75wNVtRGcJn9rwusBQohu',
    locationText: 'Victoria Road, Cape Coast, Central Region',
    phone: '+233 33 213 2526',
    estimatedTravel: '3h from Accra'
  },
  'kakum-national-park': {
    id: 'kakum-national-park',
    name: 'Kakum Canopy Walk',
    region: 'Central Region',
    score: 8.7,
    readinessPct: 94,
    readinessText: 'Excellent',
    rating: 4.8,
    reviewsCount: '1.2k Reviews',
    categories: ['Wildlife', 'Adventure'],
    descriptionTitle: 'A Journey Above the Canopy',
    paragraphs: [
      "Established in 1932, Kakum National Park is home to one of only three canopy walkways in Africa. This pristine rainforest spans 375 square kilometers and serves as a sanctuary for endangered species including forest elephants and Diana monkeys.",
      "The highlight of the park is the suspension bridge, consisting of seven bridges and spanning 330 meters. It offers a unique vantage point to witness the diverse birdlife and lush vegetation of the Guinea-Congolian forest ecosystem. Whether you're an avid hiker or a culture enthusiast, the park offers a transformative experience connecting you to Ghana's natural heritage."
    ],
    desktopHeroImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCHCkS-Pw7QHhrP5YBKBQGLUc7TULvmUs1SVn-FRj5cs169Ow44GHNpIHSc2JklUPv_xgfnBc4fLjQFpJkIA0R0i_OoDZWpKIbVgP5vRYHnhXjGjqDR8QY6-ysNztk2yRjg4AG3uGDW5YXV0esFmxo87xhbjVnibRsrDksjYOSFoXRv-g47xuzgwb-kRQenwxuHB8yo4QcVnv-twYzu7f-MfIMeGmff-TKWnnhJAY2TqmOghfTd57piPi7M8SE5GguQbO-MOLM6bms4',
    mobileHeroImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAMHA1rMp-33YtPzo31q8fiKKQxDbtLGVSJMf2xgPiNQMutbgjDvc7jBE7DbH6hVRPw3um8CxQ1cnVCu7Zer0EGC5SvxWM2ovQDZXfgsDoVdLjFbGsqClFyEUhol7Vd838DA8Iw_-BKRBAORrtFgLJBq1pcN3fxI6Qo1gyXftSHR4uYnKFB6OjL0jM8jXhGd9gUEhxUXcKsVfGJlSdMs8sUsntxQq1Fxb3w_vWL_-OmYU62Cd5QM0XQbOXIrtnPMZxjkIq1x14Qe2ge',
    price: 'GHS 60',
    priceUnit: '/ person',
    momoSupported: true,
    lowSignal: true,
    familyFriendly: true,
    proTips: {
      eat: 'Try the authentic Fante Kenkey at the nearby roadside stalls for a true Central Region taste.',
      wear: 'Comfortable hiking boots and lightweight, breathable cotton clothing to manage the humidity.'
    },
    etiquette: {
      quote: 'Respect the Silence of the Trees.',
      items: [
        'No littering (Fine enforced)',
        'Commercial filming needs permit'
      ]
    },
    reviews: [
      {
        author: 'Adwoa Mansah',
        role: 'Verified Local Traveler',
        rating: 5,
        text: "The canopy walk is breathtaking. I've been three times and every time I see something new. Highly recommend arriving at 8:00 AM before the crowds.",
        avatarInitials: 'AM',
        avatarBg: 'bg-primary-fixed'
      },
      {
        author: 'John Smith',
        role: 'Verified International Traveler',
        rating: 4,
        text: 'An incredible experience. The guides are very knowledgeable about the plant species. The path is well-maintained and felt very safe.',
        avatarInitials: 'JS',
        avatarBg: 'bg-secondary-fixed'
      }
    ],
    mapImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBMQQXhk7MffwE2M0ZjaYktbftVUlRQ-RsEwq6gxwZhXw9jFPhOvV4y7Vi8IwQ4NVjVDw0ABIyCtPIV3-GoZoLjYNb-cKluwu2dAlL22paGO8Q1BPGsENqFqTIti6yxezx9w4IzhKcLXhhP6r3PW6_VsXCfUVb6J7YWgfkx29Lir1SB02KDnxiKV7rjReyJpGfw7Rcjz7HKF1Og3CuQf4mAIJ2MDztOho-I7diL_BeNsSBOhZbhTx3A8Nw75wNVtRGcJn9rwusBQohu',
    locationText: 'Abrafo-Odumase, Cape Coast Road',
    phone: '+233 24 000 0000',
    estimatedTravel: '3h 20m from Accra'
  },
  'bonwire-kente-weaving': {
    id: 'bonwire-kente-weaving',
    name: 'Bonwire Kente Weaving',
    region: 'Ashanti Region',
    score: 8.1,
    readinessPct: 91,
    readinessText: 'Excellent',
    rating: 4.6,
    reviewsCount: '850 Reviews',
    categories: ['Culture', 'Art', 'Workshop'],
    descriptionTitle: "The Birthplace of Ghana's Royal Cloth",
    paragraphs: [
      "Bonwire is the historic town in the Ashanti Region where the art of Kente weaving was first developed in the 17th century. Kente is a hand-woven silk and cotton fabric made of interwoven cloth strips, historically worn by Ashanti royalty.",
      "Visitors can witness local weavers operating traditional wooden looms with remarkable speed and precision. You can even try weaving your own strip or purchase authentic Kente fabrics directly from the local cooperative."
    ],
    desktopHeroImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDGC9IbvlqN7aZk8EGsINdc0lS8NMtbkCv6Iqs9TNJzhj0dBs8qCztv65qDuS_yUxWDT3tUcD9kHQrNPezYcQAP8hbEea5S3hTtAKK22nG6ZeYnb7DTeaQ8bR4e7nLDchSKzEstGhZ9-Wb-EX7MFMiLQ3JZRZVnI8OnSIGs_3-jx90-4qxYH3KV7kL1QIIcYbt2iDAPJ2qHhVlj60Qs_5OsQ7obl2xJqLuE5TZ1UsJz-vm2PGggZkBQV8-ZCsZEMAFKLqY0dVuQgLNq',
    mobileHeroImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDGC9IbvlqN7aZk8EGsINdc0lS8NMtbkCv6Iqs9TNJzhj0dBs8qCztv65qDuS_yUxWDT3tUcD9kHQrNPezYcQAP8hbEea5S3hTtAKK22nG6ZeYnb7DTeaQ8bR4e7nLDchSKzEstGhZ9-Wb-EX7MFMiLQ3JZRZVnI8OnSIGs_3-jx90-4qxYH3KV7kL1QIIcYbt2iDAPJ2qHhVlj60Qs_5OsQ7obl2xJqLuE5TZ1UsJz-vm2PGggZkBQV8-ZCsZEMAFKLqY0dVuQgLNq',
    price: 'Free',
    priceUnit: 'entry',
    momoSupported: true,
    lowSignal: false,
    familyFriendly: true,
    proTips: {
      eat: 'Enjoy authentic Ashanti Fufu with Light Soup or Goat Soup at the local eateries in Bonwire.',
      wear: 'Casual clothes. Be prepared for outdoor walking under covered weaving structures.'
    },
    etiquette: {
      quote: 'Preserving the Craft of Kings.',
      items: [
        'Ask before taking photos of weavers',
        'Support the local community by purchasing from authorized weavers'
      ]
    },
    reviews: [
      {
        author: 'Kwabena Boateng',
        role: 'Verified Local Traveler',
        rating: 5,
        text: 'Amazing to see the master weavers at work. They explain the meaning of different patterns and colors. Bought a beautiful stole.',
        avatarInitials: 'KB',
        avatarBg: 'bg-primary-fixed'
      },
      {
        author: 'Sarah Jenkins',
        role: 'Verified International Traveler',
        rating: 4,
        text: 'A wonderful cultural experience! The weavers are extremely welcoming and patient when showing you how the loom works.',
        avatarInitials: 'SJ',
        avatarBg: 'bg-secondary-fixed'
      }
    ],
    mapImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBMQQXhk7MffwE2M0ZjaYktbftVUlRQ-RsEwq6gxwZhXw9jFPhOvV4y7Vi8IwQ4NVjVDw0ABIyCtPIV3-GoZoLjYNb-cKluwu2dAlL22paGO8Q1BPGsENqFqTIti6yxezx9w4IzhKcLXhhP6r3PW6_VsXCfUVb6J7YWgfkx29Lir1SB02KDnxiKV7rjReyJpGfw7Rcjz7HKF1Og3CuQf4mAIJ2MDztOho-I7diL_BeNsSBOhZbhTx3A8Nw75wNVtRGcJn9rwusBQohu',
    locationText: 'Bonwire Road, Ejisu-Juaben District, Ashanti Region',
    phone: '+233 24 123 4567',
    estimatedTravel: '4h 30m from Accra'
  },
  'mole-national-park': {
    id: 'mole-national-park',
    name: 'Mole National Park',
    region: 'Northern Region',
    score: 8.9,
    readinessPct: 89,
    readinessText: 'Excellent',
    rating: 4.7,
    reviewsCount: '1.8k Reviews',
    categories: ['Safari', 'Wildlife'],
    descriptionTitle: "Ghana's Largest Wildlife Sanctuary",
    paragraphs: [
      "Mole National Park is Ghana's largest and most prestigious wildlife refuge, covering 4,840 square kilometers. Located in the Savannah Region, it is famous for its population of African savannah elephants, which can be observed at close range.",
      "The park offers both walking safaris and driving safaris guided by armed rangers. Visitors can also spot baboons, monkeys, warthogs, antelopes, and over 300 species of birds, making it a paradise for nature lovers."
    ],
    desktopHeroImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCC4xFPjziSkwQ7wl0OE9TjR1XjIl895E-5mYlOQCJtEvoClEEsA0zRtlENb9nFsFmFbk7TbWKpEZn045gVmMQmLy2xv2Q1nAohV-5aCyF7uzNRIR8b9eGI_8yB8Fta9Z0N8444pnyXilzDGZwV2iykp19-2H23LaYHOhMP6YmgjxMFm-EDReVHyPO_RC_Sl3vhphWB4RiPFIpIVOJCP1HnPud5CZvhV338I-WGcyHoXfVl5tMoeOktIWEHJQwWPbdNrXi83mATzMKb',
    mobileHeroImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCC4xFPjziSkwQ7wl0OE9TjR1XjIl895E-5mYlOQCJtEvoClEEsA0zRtlENb9nFsFmFbk7TbWKpEZn045gVmMQmLy2xv2Q1nAohV-5aCyF7uzNRIR8b9eGI_8yB8Fta9Z0N8444pnyXilzDGZwV2iykp19-2H23LaYHOhMP6YmgjxMFm-EDReVHyPO_RC_Sl3vhphWB4RiPFIpIVOJCP1HnPud5CZvhV338I-WGcyHoXfVl5tMoeOktIWEHJQwWPbdNrXi83mATzMKb',
    price: 'GHS 120',
    priceUnit: '/ day',
    momoSupported: true,
    lowSignal: true,
    familyFriendly: true,
    proTips: {
      eat: "Dine at the Mole Motel restaurant, which overlooks the park's main watering holes where elephants bathe.",
      wear: 'Earth-toned, lightweight clothing and sturdy closed shoes. Avoid bright colors that might startle animals.'
    },
    etiquette: {
      quote: 'Living in Harmony with Wildlife.',
      items: [
        'Always stay behind your guide',
        'Do not feed or tease the animals (especially baboons)'
      ]
    },
    reviews: [
      {
        author: 'Fuseini Adams',
        role: 'Verified Local Traveler',
        rating: 5,
        text: 'Unbelievable experience! We saw a herd of five elephants bathing in the pond just 50 meters away during our walking safari.',
        avatarInitials: 'FA',
        avatarBg: 'bg-primary-fixed'
      },
      {
        author: 'Emily Watson',
        role: 'Verified International Traveler',
        rating: 4,
        text: 'Mole is beautiful. Walking safari is highly recommended. The rangers are excellent and know exactly where the wildlife is.',
        avatarInitials: 'EW',
        avatarBg: 'bg-secondary-fixed'
      }
    ],
    mapImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBMQQXhk7MffwE2M0ZjaYktbftVUlRQ-RsEwq6gxwZhXw9jFPhOvV4y7Vi8IwQ4NVjVDw0ABIyCtPIV3-GoZoLjYNb-cKluwu2dAlL22paGO8Q1BPGsENqFqTIti6yxezx9w4IzhKcLXhhP6r3PW6_VsXCfUVb6J7YWgfkx29Lir1SB02KDnxiKV7rjReyJpGfw7Rcjz7HKF1Og3CuQf4mAIJ2MDztOho-I7diL_BeNsSBOhZbhTx3A8Nw75wNVtRGcJn9rwusBQohu',
    locationText: 'Damongo, Savannah Region, Ghana',
    phone: '+233 20 812 3456',
    estimatedTravel: '9h 30m from Accra'
  },
  'boti-falls': {
    id: 'boti-falls',
    name: 'Boti Falls',
    region: 'Eastern Region',
    score: 7.8,
    readinessPct: 85,
    readinessText: 'Very Good',
    rating: 4.5,
    reviewsCount: '620 Reviews',
    categories: ['Nature', 'Hiking'],
    descriptionTitle: 'The Majestic Twin Waterfalls',
    paragraphs: [
      "Boti Falls is a double fall side-by-side during the high flow season. These fall from two distinct rivers and are mythologically referred to by locals as the 'male' and 'female' falls, which create a beautiful rainbow when they merge.",
      "The site also features the famous Umbrella Rock and the three-headed palm tree, which can be reached via a scenic guided hike through the forest. It is a perfect day-trip destination from Accra."
    ],
    desktopHeroImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvGauoKDrHrWvk8wfiO-zKhJIctlFzy8NYjmaTWXVbjZQUUdj9f85M2EVBx8h_0J0guryLZQUhE6dhxE7rLDN1AYCDNtVQFVmXwgs7pA7v6p06rXF-H3fue25hbtmqUcEBrctDImCxm21EusATqDdSituGMsx67QBBoGTlM797uc2JsudmMrvpISkMDTDoZF7TqOrLnTKt9I8gdsQ8iEY5ttz2VRDrkIlUfeY8yFHCQ61iwt2kwgtiHeXQ9OzG63eL0LQTm8lvMOsu',
    mobileHeroImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvGauoKDrHrWvk8wfiO-zKhJIctlFzy8NYjmaTWXVbjZQUUdj9f85M2EVBx8h_0J0guryLZQUhE6dhxE7rLDN1AYCDNtVQFVmXwgs7pA7v6p06rXF-H3fue25hbtmqUcEBrctDImCxm21EusATqDdSituGMsx67QBBoGTlM797uc2JsudmMrvpISkMDTDoZF7TqOrLnTKt9I8gdsQ8iEY5ttz2VRDrkIlUfeY8yFHCQ61iwt2kwgtiHeXQ9OzG63eL0LQTm8lvMOsu',
    price: 'GHS 25',
    priceUnit: '/ person',
    momoSupported: true,
    lowSignal: false,
    familyFriendly: true,
    proTips: {
      eat: 'Pack a picnic lunch to enjoy at the falls, or buy street snacks like plantain chips from local vendors.',
      wear: 'Sturdy shoes with good grip for the hike to Umbrella Rock. Bring swimwear and a change of clothes.'
    },
    etiquette: {
      quote: "Appreciating Nature's Wonders.",
      items: [
        'Stick to marked trails',
        'Swimming is only allowed when guided and safe'
      ]
    },
    reviews: [
      {
        author: 'Esi Mensah',
        role: 'Verified Local Traveler',
        rating: 5,
        text: 'Lovely place. The hike to Umbrella Rock is steep but worth it. The twin falls are stunning if you visit during the rainy season.',
        avatarInitials: 'EM',
        avatarBg: 'bg-primary-fixed'
      },
      {
        author: 'Marcus Vance',
        role: 'Verified International Traveler',
        rating: 4,
        text: 'Great escape from the city. The hike was fun and our guide was wonderful, sharing local legends about the three-headed palm tree.',
        avatarInitials: 'MV',
        avatarBg: 'bg-secondary-fixed'
      }
    ],
    mapImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBMQQXhk7MffwE2M0ZjaYktbftVUlRQ-RsEwq6gxwZhXw9jFPhOvV4y7Vi8IwQ4NVjVDw0ABIyCtPIV3-GoZoLjYNb-cKluwu2dAlL22paGO8Q1BPGsENqFqTIti6yxezx9w4IzhKcLXhhP6r3PW6_VsXCfUVb6J7YWgfkx29Lir1SB02KDnxiKV7rjReyJpGfw7Rcjz7HKF1Og3CuQf4mAIJ2MDztOho-I7diL_BeNsSBOhZbhTx3A8Nw75wNVtRGcJn9rwusBQohu',
    locationText: 'Boti, Huhunya, Eastern Region, Ghana',
    phone: '+233 24 555 6789',
    estimatedTravel: '2h from Accra'
  },
  'nkrumah-memorial': {
    id: 'nkrumah-memorial',
    name: 'Nkrumah Memorial',
    region: 'Greater Accra',
    score: 9.5,
    readinessPct: 96,
    readinessText: 'Excellent',
    rating: 4.9,
    reviewsCount: '3.1k Reviews',
    categories: ['History', 'Museum', 'Urban'],
    descriptionTitle: 'Honoring the Father of Modern Ghana',
    paragraphs: [
      "The Kwame Nkrumah Memorial Park is dedicated to the prominent Ghanaian leader Kwame Nkrumah, who led the country to independence from British colonial rule in 1957. The park contains his mausoleum and a museum showcasing his life.",
      "The mausoleum itself is a masterpiece of modern architecture, shaped like an upside-down sword, which in Akan culture symbolises peace. Surrounded by beautiful fountains and manicured lawns, it is a serene place of reflection."
    ],
    desktopHeroImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCf3xOmwSXPv3JCMVQXIohPDDEuJFQuSfMvqqoX-aVnBnCx0Gvp2UKW9rB-FSo5G_cZRvtN_iy9r9lhUsEtzhjKaZMeP1BYzHKaUONWYXz1BTzP_kb3B7GKFflthKaDNJeHLgmKyUS8u0pGZ_iEiFua1TMoJrR1QUB-F58FYWX1lOWSc5WOXNBZDFFOXvCiTqyUC8wqU14i7PTtQadKTcuyJW9fEMOESD9KiugQZZPyZpmpIq6r_Xs3zACfLgfJxn6aDelA-tWwGL8R',
    mobileHeroImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCf3xOmwSXPv3JCMVQXIohPDDEuJFQuSfMvqqoX-aVnBnCx0Gvp2UKW9rB-FSo5G_cZRvtN_iy9r9lhUsEtzhjKaZMeP1BYzHKaUONWYXz1BTzP_kb3B7GKFflthKaDNJeHLgmKyUS8u0pGZ_iEiFua1TMoJrR1QUB-F58FYWX1lOWSc5WOXNBZDFFOXvCiTqyUC8wqU14i7PTtQadKTcuyJW9fEMOESD9KiugQZZPyZpmpIq6r_Xs3zACfLgfJxn6aDelA-tWwGL8R',
    price: 'GHS 50',
    priceUnit: '/ person',
    momoSupported: true,
    lowSignal: false,
    familyFriendly: true,
    proTips: {
      eat: 'Try delicious Jollof rice and Kelewele at restaurants in the nearby arts center or downtown Accra.',
      wear: 'Standard casual wear. Walking is mostly on paved paths, so any comfortable shoes are fine.'
    },
    etiquette: {
      quote: 'Paying Homage to History.',
      items: [
        'Speak softly inside the mausoleum',
        'No touching of sensitive exhibits in the museum'
      ]
    },
    reviews: [
      {
        author: 'Yao Dzide',
        role: 'Verified Local Traveler',
        rating: 5,
        text: "Beautifully renovated park! The fountains are spectacular, and the museum houses a fascinating collection of Nkrumah's personal items.",
        avatarInitials: 'YD',
        avatarBg: 'bg-primary-fixed'
      },
      {
        author: 'Chloe Bennett',
        role: 'Verified International Traveler',
        rating: 5,
        text: 'A must-visit in Accra. The tour is quick but very informative. The design of the mausoleum is truly stunning.',
        avatarInitials: 'CB',
        avatarBg: 'bg-secondary-fixed'
      }
    ],
    mapImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBMQQXhk7MffwE2M0ZjaYktbftVUlRQ-RsEwq6gxwZhXw9jFPhOvV4y7Vi8IwQ4NVjVDw0ABIyCtPIV3-GoZoLjYNb-cKluwu2dAlL22paGO8Q1BPGsENqFqTIti6yxezx9w4IzhKcLXhhP6r3PW6_VsXCfUVb6J7YWgfkx29Lir1SB02KDnxiKV7rjReyJpGfw7Rcjz7HKF1Og3CuQf4mAIJ2MDztOho-I7diL_BeNsSBOhZbhTx3A8Nw75wNVtRGcJn9rwusBQohu',
    locationText: 'High Street, Accra, Greater Accra, Ghana',
    phone: '+233 30 268 0100',
    estimatedTravel: '15m from Accra'
  },
  'makola-market': {
    id: 'makola-market',
    name: 'Makola Market Tour',
    region: 'Greater Accra',
    score: 8.5,
    readinessPct: 92,
    readinessText: 'Very Good',
    rating: 4.7,
    reviewsCount: '950 Reviews',
    categories: ['Culture', 'Shopping'],
    descriptionTitle: 'The Vibrant Heartbeat of Accra',
    paragraphs: [
      "Makola Market is a renowned marketplace and shopping district in the centre of the city of Accra. It was constructed in 1924 and stands as the epicentre of urban trade in Ghana, dominated by strong, entrepreneurial Ghanaian women.",
      "A guided walking tour through Makola is a rich sensory experience. Visitors can explore stalls filled with colorful wax prints, fresh local produce, traditional medicines, handcrafted beads, and delicious street food, capturing the authentic spirit of Accra."
    ],
    desktopHeroImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCiB4aCTpXhhQv7-UKa_xEmGMMapmX4OSiKgPmsuhtrjGIbTu9GlNmItLI6p3JdWwGQkPOfzVSVu3-ZNvvNRcaHfzRKvqMPpi0TgdfJ4_mpFs5QoaUnfbnUwN5-ESi3d3FqpxE8cl2vJS9_5w_joR9H5KyHEMJnxYCaGfHM4bnwoURT-BHz_x3kTO0c3EXU7VtqvP9T3qp3Sqkj8dFSvpR1GRNrNosQeHo3Lipz1UuxnpArV1t2dlAc7mmo7hJf8nO4pYkUvbBYmm7D',
    mobileHeroImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCiB4aCTpXhhQv7-UKa_xEmGMMapmX4OSiKgPmsuhtrjGIbTu9GlNmItLI6p3JdWwGQkPOfzVSVu3-ZNvvNRcaHfzRKvqMPpi0TgdfJ4_mpFs5QoaUnfbnUwN5-ESi3d3FqpxE8cl2vJS9_5w_joR9H5KyHEMJnxYCaGfHM4bnwoURT-BHz_x3kTO0c3EXU7VtqvP9T3qp3Sqkj8dFSvpR1GRNrNosQeHo3Lipz1UuxnpArV1t2dlAc7mmo7hJf8nO4pYkUvbBYmm7D',
    price: 'Free',
    priceUnit: 'entry',
    momoSupported: true,
    lowSignal: false,
    familyFriendly: true,
    proTips: {
      eat: 'Try hot Kelewele (spiced fried plantain) or Waakye from the famous food stalls inside the market.',
      wear: 'Casual clothes and secure closed-toe walking shoes. Avoid carrying bulky bags.'
    },
    etiquette: {
      quote: 'Immerse Yourself in the Commerce.',
      items: [
        'Always ask vendors politely before taking photos of them',
        'Bargain with a friendly smile—it is expected and part of the culture'
      ]
    },
    reviews: [
      {
        author: 'Kojo Mensah',
        role: 'Verified Local Traveler',
        rating: 5,
        text: 'The energy in Makola is unmatched. If you want to experience the real Accra, you must go. A guide is highly recommended for first-timers.',
        avatarInitials: 'KM',
        avatarBg: 'bg-primary-fixed'
      },
      {
        author: 'Jessica Taylor',
        role: 'Verified International Traveler',
        rating: 4,
        text: 'An absolute sensory overload in the best way possible! The fabrics are beautiful and cheap. Wear comfortable shoes.',
        avatarInitials: 'JT',
        avatarBg: 'bg-secondary-fixed'
      }
    ],
    mapImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBMQQXhk7MffwE2M0ZjaYktbftVUlRQ-RsEwq6gxwZhXw9jFPhOvV4y7Vi8IwQ4NVjVDw0ABIyCtPIV3-GoZoLjYNb-cKluwu2dAlL22paGO8Q1BPGsENqFqTIti6yxezx9w4IzhKcLXhhP6r3PW6_VsXCfUVb6J7YWgfkx29Lir1SB02KDnxiKV7rjReyJpGfw7Rcjz7HKF1Og3CuQf4mAIJ2MDztOho-I7diL_BeNsSBOhZbhTx3A8Nw75wNVtRGcJn9rwusBQohu',
    locationText: 'Kojo Thompson Road, Central Accra, Greater Accra, Ghana',
    phone: '+233 24 999 8888',
    estimatedTravel: '10m from Accra'
  }
};

export function AttractionDetail({ id = 'kakum-national-park' }: AttractionDetailProps) {
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);
  const [downloadingOffline, setDownloadingOffline] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  // Normalize id or fallback to kakum if not found
  const normalizedId = ATTRACTIONS_DETAIL_DATA[id] ? id : 'kakum-national-park';
  const data = ATTRACTIONS_DETAIL_DATA[normalizedId];

  const handleDownloadOffline = () => {
    setDownloadingOffline(true);
    setTimeout(() => {
      setDownloadingOffline(false);
      setDownloaded(true);
    }, 1500);
  };

  const handleShare = () => {
    if (typeof window !== 'undefined' && navigator.share) {
      navigator.share({
        title: `${data.name} — GhanaXplore`,
        url: window.location.href,
      }).catch(() => {});
    } else if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleBookNow = () => {
    alert(`Booking initiated for ${data.name}! We are redirecting you to our secure payment gateway.`);
  };

  // Get dynamic recommendations
  const getRecommendations = () => {
    const list = Object.values(ATTRACTIONS_DETAIL_DATA);
    return list.filter((item) => item.id !== normalizedId).slice(0, 3);
  };

  const recommendations = getRecommendations();

  return (
    <div className="w-full bg-background font-body-md text-on-background selection:bg-secondary-container/30 pb-0">
      <style>{`
        .bento-grid-custom {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: 24px;
        }
        .glass-card-custom {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
        .hero-gradient-custom {
          background: linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 70%, rgba(252,249,248,1) 100%);
        }
      `}</style>

      {/* ========================================== */}
      {/* DESKTOP LAYOUT (md and above)              */}
      {/* ========================================== */}
      <div className="hidden md:block">
        {/* Hero Section */}
        <section className="relative w-full h-[716px] min-h-[500px] flex items-end overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div
              className="w-full h-full bg-cover bg-center"
              style={{
                backgroundImage: `url('${data.desktopHeroImage}')`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          </div>
          <div className="relative z-10 max-w-7xl mx-auto w-full px-container-padding-desktop pb-12">
            <div className="flex flex-col gap-4 max-w-2xl">
              <div className="flex items-center gap-3">
                <span className="bg-secondary-container text-on-secondary-container px-4 py-1 rounded-full font-label-lg text-label-lg flex items-center gap-1">
                  <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    stars
                  </span>
                  Must Visit
                </span>
                <span className="text-white/80 font-label-lg text-label-lg uppercase tracking-widest flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">location_on</span>
                  {data.region}
                </span>
              </div>
              <h1 className="font-display-lg text-display-lg text-white leading-tight">
                {data.name}
              </h1>
              <p className="text-white/90 font-body-lg text-body-lg max-w-xl">
                {data.paragraphs[0]}
              </p>
            </div>
          </div>
        </section>

        {/* Main Content & Sidebar */}
        <section className="max-w-7xl mx-auto px-container-padding-desktop py-12">
          <div className="grid grid-cols-12 gap-12">
            {/* Left: Content (col-span-8) */}
            <div className="col-span-8 flex flex-col gap-section-gap">
              {/* Essential Stats */}
              <div className="grid grid-cols-3 gap-6">
                <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/30 flex flex-col gap-2">
                  <span className="text-outline font-label-lg text-label-lg uppercase">Entry Fee</span>
                  <div className="flex items-baseline gap-1">
                    <span className="font-headline-md text-headline-md text-primary">{data.price}</span>
                    <span className="text-on-surface-variant font-label-sm text-label-sm">{data.priceUnit}</span>
                  </div>
                </div>
                <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/30 flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-outline font-label-lg text-label-lg uppercase">Readiness Score</span>
                    <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                      verified
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="font-headline-md text-headline-md text-primary">{data.readinessPct}%</span>
                    <span className="text-primary font-label-sm text-label-sm">{data.readinessText}</span>
                  </div>
                </div>
                <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/30 flex flex-col gap-2">
                  <span className="text-outline font-label-lg text-label-lg uppercase">Categories</span>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {data.categories.map((cat) => (
                      <span key={cat} className="bg-secondary-fixed text-on-secondary-fixed-variant px-3 py-1 rounded-full text-label-sm font-label-sm">
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-6">
                <h2 className="font-headline-lg text-headline-lg text-primary">{data.descriptionTitle}</h2>
                <div className="space-y-4 text-on-surface-variant font-body-lg text-body-lg leading-relaxed">
                  {data.paragraphs.map((para, idx) => (
                    <p key={idx}>{para}</p>
                  ))}
                </div>
              </div>

              {/* Tips / Heritage Section (Bento Style) */}
              <div className="bento-grid-custom">
                <div className="col-span-7 bg-primary-container text-on-primary-container p-8 rounded-[32px] flex flex-col justify-between min-h-[300px]">
                  <div>
                    <h3 className="font-headline-md text-headline-md mb-4 text-white">Local Guide: Pro Tips</h3>
                    <ul className="space-y-4 text-white">
                      <li className="flex gap-4">
                        <span className="material-symbols-outlined text-secondary-fixed-dim">restaurant</span>
                        <p className="font-body-md text-body-md">
                          <span className="font-bold">Eat:</span> {data.proTips.eat}
                        </p>
                      </li>
                      <li className="flex gap-4">
                        <span className="material-symbols-outlined text-secondary-fixed-dim">eco</span>
                        <p className="font-body-md text-body-md">
                          <span className="font-bold">Wear:</span> {data.proTips.wear}
                        </p>
                      </li>
                    </ul>
                  </div>
                  <div className="mt-8 flex items-center gap-2 font-label-lg text-label-lg opacity-80 text-white">
                    <span className="material-symbols-outlined">info</span>
                    Verified by Ghana Tourism Authority
                  </div>
                </div>
                <div className="col-span-5 bg-secondary-container p-8 rounded-[32px] flex flex-col gap-6">
                  <h3 className="font-headline-md text-headline-md text-on-secondary-container">Etiquette</h3>
                  <p className="text-on-secondary-container/90 font-body-md text-body-md italic">
                    &quot;{data.etiquette.quote}&quot;
                  </p>
                  <div className="space-y-3">
                    {data.etiquette.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-on-secondary-container font-label-lg">
                        <span className="material-symbols-outlined">
                          {idx === 0 ? 'do_not_disturb_on' : 'camera_enhance'}
                        </span>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Reviews */}
              <div className="flex flex-col gap-8">
                <div className="flex justify-between items-end">
                  <h2 className="font-headline-lg text-headline-lg text-primary">Traveler Voices</h2>
                  <button className="text-primary font-label-lg text-label-lg hover:underline flex items-center gap-2">
                    View all {data.reviewsCount}
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  {data.reviews.map((rev, idx) => (
                    <div key={idx} className="p-6 rounded-2xl bg-surface border border-outline-variant/30 shadow-sm flex flex-col gap-4">
                      <div className="flex justify-between items-start">
                        <div className="flex gap-3 items-center">
                          <div className={`w-10 h-10 rounded-full ${rev.avatarBg} flex items-center justify-center font-bold text-on-surface-variant`}>
                            {rev.avatarInitials}
                          </div>
                          <div>
                            <p className="font-label-lg text-label-lg text-on-surface">{rev.author}</p>
                            <p className="text-outline font-label-sm text-label-sm">{rev.role}</p>
                          </div>
                        </div>
                        <div className="flex text-secondary">
                          {[...Array(rev.rating)].map((_, i) => (
                            <span
                              key={i}
                              className="material-symbols-outlined text-[18px]"
                              style={{ fontVariationSettings: "'FILL' 1" }}
                            >
                              star
                            </span>
                          ))}
                          {[...Array(5 - rev.rating)].map((_, i) => (
                            <span key={i} className="material-symbols-outlined text-[18px]">
                              star
                            </span>
                          ))}
                        </div>
                      </div>
                      <p className="text-on-surface-variant font-body-md line-clamp-3">
                        &quot;{rev.text}&quot;
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Sidebar Sticky (col-span-4) */}
            <div className="col-span-4">
              <div className="sticky top-28 flex flex-col gap-8">
                {/* Booking Card */}
                <div className="bg-surface-container-lowest p-8 rounded-[32px] border border-outline-variant/50 shadow-xl flex flex-col gap-6">
                  <div className="flex justify-between items-center">
                    <span className="font-headline-md text-headline-md text-on-surface">Book Experience</span>
                    <div className="flex items-center gap-1 bg-primary/10 px-3 py-1 rounded-full text-primary font-label-lg">
                      <span className="material-symbols-outlined text-[16px]">bolt</span>
                      Instant
                    </div>
                  </div>
                  <div className="space-y-4">
                    <button
                      onClick={handleBookNow}
                      className="w-full bg-primary text-on-primary py-4 rounded-xl font-label-lg text-label-lg flex items-center justify-center gap-2 transition-all hover:brightness-110 active:scale-[0.98]"
                    >
                      <span className="material-symbols-outlined">event_available</span>
                      Book Now
                    </button>
                    <button
                      onClick={() => setIsFavorite(!isFavorite)}
                      className={`w-full border-2 border-primary py-4 rounded-xl font-label-lg text-label-lg flex items-center justify-center gap-2 transition-all ${
                        isFavorite ? 'bg-primary/10 text-primary font-bold' : 'text-primary hover:bg-primary/5'
                      }`}
                    >
                      <span
                        className="material-symbols-outlined"
                        style={isFavorite ? { fontVariationSettings: "'FILL' 1" } : undefined}
                      >
                        favorite
                      </span>
                      {isFavorite ? 'Saved to Wishlist' : 'Save to Wishlist'}
                    </button>
                  </div>
                  <hr className="border-outline-variant/30" />
                  <div className="flex flex-col gap-4">
                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-secondary-container/10 border border-secondary-container/20">
                      <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>
                        cloud_download
                      </span>
                      <div>
                        <h4 className="font-label-lg text-label-lg text-on-surface">Offline Expert Guide</h4>
                        <p className="text-label-sm text-on-surface-variant">Includes maps &amp; audio tours for no-signal zones.</p>
                        <button
                          onClick={handleDownloadOffline}
                          disabled={downloadingOffline || downloaded}
                          className="mt-3 text-secondary font-bold text-label-sm flex items-center gap-1 hover:underline disabled:opacity-60"
                        >
                          {downloadingOffline ? 'Downloading...' : downloaded ? 'Downloaded (Offline Ready)' : 'Download Now (12MB)'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location Card */}
                <div className="bg-surface-container-low p-6 rounded-[32px] border border-outline-variant/30 flex flex-col gap-6">
                  <div className="h-48 rounded-2xl overflow-hidden relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      className="w-full h-full object-cover"
                      src={data.mapImage}
                      alt="Location map thumbnail"
                    />
                    <div className="absolute inset-0 bg-primary/10 pointer-events-none" />
                    <div className="absolute bottom-4 left-4 right-4 glass-card-custom p-3 rounded-xl flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="text-label-sm font-label-sm text-outline">Estimated Travel</span>
                        <span className="text-label-lg font-label-lg text-primary">{data.estimatedTravel}</span>
                      </div>
                      <button
                        onClick={handleShare}
                        className="bg-primary p-2 rounded-lg text-on-primary flex items-center justify-center hover:opacity-90 transition-opacity"
                      >
                        <span className="material-symbols-outlined">directions_car</span>
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3 text-on-surface-variant font-label-lg">
                      <span className="material-symbols-outlined text-primary">location_on</span>
                      {data.locationText}
                    </div>
                    <div className="flex items-center gap-3 text-on-surface-variant font-label-lg">
                      <span className="material-symbols-outlined text-primary">call</span>
                      {data.phone}
                    </div>
                  </div>
                  <button
                    onClick={handleShare}
                    className="w-full bg-surface-container-highest text-on-surface py-3 rounded-xl font-label-lg text-label-lg flex items-center justify-center gap-2 hover:bg-surface-variant transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">share</span>
                    Share with Friends
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Nearby Recommendations */}
        <section className="bg-surface-container-low py-section-gap">
          <div className="max-w-7xl mx-auto px-container-padding-desktop">
            <div className="flex flex-col gap-8">
              <div className="flex items-center gap-4">
                <h2 className="font-headline-lg text-headline-lg text-primary animate-pulse">Continue Your Journey</h2>
                <div className="h-[1px] flex-grow bg-outline-variant/50"></div>
                <span className="font-label-lg text-label-lg text-outline">Powered by ReloM8</span>
              </div>
              <div className="grid grid-cols-3 gap-gutter">
                {recommendations.map((rec) => (
                  <Link key={rec.id} href={`/attractions/${rec.id}`} className="group cursor-pointer">
                    <div className="aspect-video rounded-3xl overflow-hidden mb-4 relative">
                      <div
                        className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                        style={{
                          backgroundImage: `url('${rec.desktopHeroImage}')`,
                        }}
                      />
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-label-sm font-label-sm text-primary">
                        {rec.estimatedTravel.split(' from ')[0]}
                      </div>
                    </div>
                    <h3 className="font-headline-md text-headline-md text-on-surface group-hover:text-primary transition-colors">
                      {rec.name}
                    </h3>
                    <p className="text-on-surface-variant font-label-lg text-label-lg mt-1 italic">{rec.categories.join(' & ')}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ========================================== */}
      {/* MOBILE LAYOUT (md hidden)                  */}
      {/* ========================================== */}
      <div className="block md:hidden">
        {/* Sticky Bottom Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 z-[60] bg-surface/90 backdrop-blur-md px-container-padding-mobile py-4 shadow-[0px_-4px_20px_rgba(0,0,0,0.1)] flex items-center justify-between border-t border-outline-variant/20">
          <div>
            <p className="font-label-sm text-on-surface-variant">Starting from</p>
            <p className="font-headline-md text-primary">{data.price === 'Free' ? 'Free' : `${data.price}.00`}</p>
          </div>
          <button
            onClick={handleBookNow}
            className="bg-secondary-container hover:bg-secondary-fixed text-on-secondary-container px-8 py-3 rounded-xl font-label-lg font-bold shadow-sm transition-transform active:scale-95"
          >
            {data.price === 'Free' ? 'Register' : 'Book Now'}
          </button>
        </div>

        {/* Immersive Hero Section */}
        <section className="relative h-[574px] w-full overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('${data.mobileHeroImage}')`,
            }}
          />
          <div className="absolute inset-0 hero-gradient-custom"></div>
          
          {/* Top Overlay Controls */}
          <div className="absolute top-0 left-0 right-0 px-container-padding-mobile py-6 flex justify-between items-center z-20">
            <button
              className="w-10 h-10 flex items-center justify-center bg-white/20 backdrop-blur-md rounded-full text-white border border-white/30 active:scale-90 transition-all"
              onClick={() => router.push('/attractions')}
            >
              <span className="material-symbols-outlined">arrow_back_ios_new</span>
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`w-10 h-10 flex items-center justify-center bg-white/20 backdrop-blur-md rounded-full border border-white/30 active:scale-90 transition-all ${
                  isFavorite ? 'text-error' : 'text-white'
                }`}
              >
                <span
                  className="material-symbols-outlined"
                  style={isFavorite ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  favorite
                </span>
              </button>
              <button
                className="w-10 h-10 flex items-center justify-center bg-white/20 backdrop-blur-md rounded-full text-white border border-white/30 active:scale-90 transition-all"
                onClick={handleShare}
              >
                <span className="material-symbols-outlined">share</span>
              </button>
            </div>
          </div>
          
          {/* Hero Content Bottom */}
          <div className="absolute bottom-6 left-0 right-0 px-container-padding-mobile">
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="bg-primary-container text-on-primary-container px-3 py-1 rounded-full text-label-sm flex items-center gap-1">
                <span
                  className="material-symbols-outlined text-[14px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
                {data.rating} ({data.reviewsCount})
              </span>
              <span className="bg-secondary-container/90 backdrop-blur-sm text-on-secondary-container px-3 py-1 rounded-full text-label-sm font-bold">
                Top Rated
              </span>
            </div>
            <h1 className="font-display-lg-mobile text-on-surface leading-tight text-3xl font-bold">{data.name}</h1>
            <p className="font-body-md text-on-surface-variant flex items-center gap-1 mt-1">
              <span className="material-symbols-outlined text-[18px]">location_on</span>
              {data.region}, Ghana
            </p>
          </div>
        </section>

        {/* Main Content & Bottom Margin for Floating Action Bar */}
        <main className="px-container-padding-mobile pb-32 -mt-4 relative z-10">
          {/* Quick Stats Bento Row */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/30">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-primary">verified</span>
                <span className="font-label-lg text-on-surface">Readiness</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-primary">{data.readinessPct}</span>
                <span className="text-on-surface-variant font-label-sm">/100</span>
              </div>
              <p className="text-label-sm text-on-surface-variant mt-1">Ready for visitors today</p>
            </div>
            
            <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/30 flex flex-col justify-between">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full border-2 border-surface overflow-hidden bg-primary-fixed">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCfrmUxozhCfkDvByI9bIBYsl8Dyj6E110SARSC2I1A69JurIL89x8GX3oQd1bphWKFEWKBuPuBRUjCaTr-D2FjKEdHzTXakvST-2meyYI4fTi7Tyt7Dd1LuP_-ulXmsPhEBOHZPTYGP225p-CHWQcMav_pTXDYRDvQctZJysLGPYJqeBkpSHEssK3_YwAs83NxJSxeb2PNlp7haeAthQSeQfcN9nWupMeO7leeP0m6FDD_BVY7z36WzcH0uu34NATGMPk8x2Nd7vwT"
                    alt="Guide"
                  />
                </div>
                <div className="w-8 h-8 rounded-full border-2 border-surface overflow-hidden bg-secondary-fixed">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxBlF6ZVtb-mKB1IfrGGTLuJcN5NRZASkydMHaF8HYHcp10R2_ram0m6URTxUsucPfu8gRs3HOxxAY7wADIziN3KQOORag7ypZO3tcLP7C5fDGhkr-3fkvP5TnSuivo5S47Hn1GrTGLHSNP68a355Xl728i_bPhbKs8kZ84rFVx9GvDvFjDYZFv3kbUtLQTp2dGXCTmE72kyUqbcPHCPcu-Vfyw6e4qcdozyZS5RNAszWNQKCoC7sP5uPwOxtnuOPsaxHDPrfD0Y9P"
                    alt="Traveler avatar"
                  />
                </div>
                <div className="w-8 h-8 rounded-full border-2 border-surface bg-surface-variant flex items-center justify-center text-[10px] font-bold">+8</div>
              </div>
              <p className="text-label-sm text-on-surface-variant font-semibold mt-2">Active tours right now</p>
            </div>
          </div>

          {/* Features Bar */}
          <div className="flex justify-between items-center py-4 px-2 mb-8 bg-surface border-y border-outline-variant/20 overflow-x-auto hide-scrollbar gap-6">
            <div className="flex flex-col items-center gap-1 shrink-0">
              <span className="material-symbols-outlined text-primary p-2 bg-primary-fixed/30 rounded-full">download_for_offline</span>
              <span className="text-[10px] font-bold text-on-surface-variant">Offline Guide</span>
            </div>
            {data.momoSupported && (
              <div className="flex flex-col items-center gap-1 shrink-0">
                <span className="material-symbols-outlined text-primary p-2 bg-primary-fixed/30 rounded-full">account_balance_wallet</span>
                <span className="text-[10px] font-bold text-on-surface-variant">MoMo Supported</span>
              </div>
            )}
            {data.lowSignal && (
              <div className="flex flex-col items-center gap-1 shrink-0">
                <span className="material-symbols-outlined text-primary p-2 bg-primary-fixed/30 rounded-full">wifi_off</span>
                <span className="text-[10px] font-bold text-on-surface-variant">Low Signal Area</span>
              </div>
            )}
            {data.familyFriendly && (
              <div className="flex flex-col items-center gap-1 shrink-0">
                <span className="material-symbols-outlined text-primary p-2 bg-primary-fixed/30 rounded-full">stroller</span>
                <span className="text-[10px] font-bold text-on-surface-variant">Family Friendly</span>
              </div>
            )}
          </div>

          {/* Expandable Details */}
          <div className="space-y-4 mb-10">
            {/* Description */}
            <details className="group bg-white rounded-2xl border border-outline-variant/30 overflow-hidden" open>
              <summary className="flex justify-between items-center p-5 cursor-pointer list-none">
                <h3 className="font-headline-md text-on-surface text-lg font-bold">Description</h3>
                <span className="material-symbols-outlined group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <div className="px-5 pb-5 text-on-surface-variant leading-relaxed text-sm">
                {data.paragraphs.join(' ')}
              </div>
            </details>
            
            {/* Local Food Guide */}
            <details className="group bg-white rounded-2xl border border-outline-variant/30 overflow-hidden">
              <summary className="flex justify-between items-center p-5 cursor-pointer list-none">
                <h3 className="font-headline-md text-on-surface text-lg font-bold">Local Food Guide</h3>
                <span className="material-symbols-outlined group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <div className="px-5 pb-5">
                <div className="flex gap-4 p-3 bg-surface-container-low rounded-xl mb-3">
                  <div className="w-16 h-16 rounded-lg bg-gray-200 overflow-hidden shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      className="w-full h-full object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzqfoUKB-JluYhQRkpZF78-0zcXj7KCpby5g10mX5au4llfw_IL2GNeZmz4C-7mvScYGHObIaY0xMbB8CiieG_ruA8m37MtvE8TjdJnnm1-O0lIFz_oJWurAX3vgwmfCC5lUmchKQVMj-IZtn5SjjQ8efR5Yz7fMEZIJyua5qLCQJt5j9K5Bx4O-_r7DlIV7KmCI4WBxxjbhp_PsFvsz-0r9SsOf5xhA87rSZ5aiav1u7waJAtbwwxppGOe1uq3N4Zkl2GVwBKwtX3"
                      alt="Local Food"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-on-surface text-sm">Local Cuisine</p>
                    <p className="text-xs text-on-surface-variant">{data.proTips.eat}</p>
                  </div>
                </div>
              </div>
            </details>
            
            {/* Culture Tips */}
            <details className="group bg-white rounded-2xl border border-outline-variant/30 overflow-hidden">
              <summary className="flex justify-between items-center p-5 cursor-pointer list-none">
                <h3 className="font-headline-md text-on-surface text-lg font-bold">Culture Tips</h3>
                <span className="material-symbols-outlined group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <div className="px-5 pb-5 space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-secondary">info</span>
                  <p className="text-on-surface-variant">Always greet the guides and locals with respect and seek guidance where appropriate.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-secondary">front_hand</span>
                  <p className="text-on-surface-variant">Follow local traditions and show appreciation for the heritage and natural sites.</p>
                </div>
              </div>
            </details>
          </div>

          {/* Map Section */}
          <section className="mb-10">
            <h3 className="font-headline-md text-on-surface mb-4 text-lg font-bold">Location</h3>
            <div className="relative w-full h-48 rounded-2xl overflow-hidden border border-outline-variant/30">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="w-full h-full object-cover"
                src={data.mapImage}
                alt="Map"
              />
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                <button
                  className="bg-primary text-white px-6 py-2 rounded-full font-label-lg flex items-center gap-2 shadow-lg active:scale-95 transition-all text-sm font-semibold"
                  onClick={handleShare}
                >
                  <span className="material-symbols-outlined text-sm">directions</span>
                  Navigate
                </button>
              </div>
            </div>
          </section>

          {/* Verified Reviews */}
          <section className="mb-10">
            <div className="flex justify-between items-end mb-4">
              <h3 className="font-headline-md text-on-surface text-lg font-bold">Verified Reviews</h3>
              <a className="text-primary font-label-sm hover:underline" href="#">See all</a>
            </div>
            <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4 -mx-container-padding-mobile px-container-padding-mobile">
              {data.reviews.map((rev, idx) => (
                <div key={idx} className="min-w-[280px] bg-white p-5 rounded-2xl border border-outline-variant/30 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-full ${rev.avatarBg} flex items-center justify-center font-bold text-primary`}>
                      {rev.avatarInitials}
                    </div>
                    <div>
                      <p className="font-bold text-sm">{rev.author}</p>
                      <div className="flex text-secondary-container scale-75 origin-left">
                        {[...Array(rev.rating)].map((_, i) => (
                          <span
                            key={i}
                            className="material-symbols-outlined"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                          >
                            star
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-on-surface-variant text-sm italic">
                    &quot;{rev.text}&quot;
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Nearby Attractions */}
          <section className="mb-10">
            <h3 className="font-headline-md text-on-surface mb-4 text-lg font-bold">You Might Also Like</h3>
            <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4 -mx-container-padding-mobile px-container-padding-mobile">
              {recommendations.map((rec) => (
                <Link key={rec.id} href={`/attractions/${rec.id}`} className="min-w-[180px] group cursor-pointer block shrink-0">
                  <div className="h-32 rounded-2xl bg-gray-200 overflow-hidden mb-2 relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      src={rec.desktopHeroImage}
                      alt={rec.name}
                    />
                  </div>
                  <p className="font-bold text-on-surface text-sm truncate">{rec.name}</p>
                  <p className="text-xs text-on-surface-variant">{rec.estimatedTravel.split(' from ')[0]} away</p>
                </Link>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
