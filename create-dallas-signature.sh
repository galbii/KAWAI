#!/bin/bash

curl -X POST http://localhost:3001/api/dealer-locations \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "dallas-signature",
    "locationName": "Dallas Signature Piano Gallery",
    "isActive": true,
    "locationText": "Dallas'\''s Premier Piano Gallery",
    "establishedText": "Est. 1985 • Dallas, Texas",
    "titlePrefix": "The",
    "titleMain": "INSTRUMENTAL",
    "titleSuffix": "to Life",
    "description": "Every musician harbors a vision. Every performance seeks perfection. Since 1985, we'\''ve been crafting the instruments that transform inspiration into reality. Visit our Dallas showroom and discover why we'\''re Texas'\''s trusted Kawai piano experts.",
    "primaryCta": {
      "text": "View Our Piano Collection",
      "link": "/pianos"
    },
    "secondaryCta": {
      "text": "Visit Our Dallas Showroom",
      "link": "/contact"
    },
    "sectionHeader": "Our Showroom",
    "showroomTitle": "Visit Our Dallas",
    "showroomDescription": "Experience the artistry of Kawai pianos in Texas'\''s premier Piano Gallery. From intimate consultations to comprehensive piano services, discover why discerning musicians choose our Dallas showroom.",
    "showroomInfo": {
      "name": "Kawai Piano Gallery Dallas",
      "address": "123 Music Row, Suite 500, Dallas, TX 75201",
      "phone": "214-555-0123",
      "serviceArea": "Serving Dallas, Fort Worth, Richardson, Plano & surrounding Texas areas"
    },
    "hours": [
      { "day": "Monday", "time": "10:00 am–7:00 pm" },
      { "day": "Tuesday", "time": "10:00 am–7:00 pm" },
      { "day": "Wednesday", "time": "10:00 am–7:00 pm" },
      { "day": "Thursday", "time": "10:00 am–7:00 pm" },
      { "day": "Friday", "time": "10:00 am–7:00 pm" },
      { "day": "Saturday", "time": "10:00 am–6:00 pm" },
      { "day": "Sunday", "time": "1:00 pm–5:00 pm" }
    ],
    "features": [
      { "icon": "award", "title": "Expert Piano Consultation", "description": "Personalized guidance from our Piano Gallery specialists" },
      { "icon": "piano", "title": "Complete Piano Services", "description": "Professional tuning, repair, and maintenance by certified piano technicians" },
      { "icon": "shield", "title": "Piano Financing Available", "description": "Flexible payment options to make your perfect piano accessible" }
    ],
    "showroomCtas": {
      "directionsText": "Get Directions",
      "directionsLink": "https://maps.google.com/?q=Dallas+TX",
      "scheduleText": "Schedule Visit",
      "scheduleLink": "/contact/schedule-visit"
    },
    "collectionSectionHeader": "Featured Models",
    "collectionTitle": "Kawai K-500 &\\nGX2 Limited Edition",
    "collectionDescription": "Discover the exceptional craftsmanship and innovation that defines our most sought-after instruments",
    "collectionCta": {
      "text": "Explore Collection",
      "link": "/pianos"
    },
    "featuredVideo": {
      "youtubeId": "1cmwb6evs2A",
      "width": 800,
      "height": 500
    },
    "contactTitle": "Find Your Perfect",
    "contactTitleHighlight": "Piano",
    "contactDescription": "Get your free Piano Buying Guide and personalized recommendations from our Dallas Piano Gallery specialists. Serving the Dallas area for over 35 years.",
    "stepTitles": [
      { "step": "Tell us about your piano journey" },
      { "step": "Help us understand your needs" },
      { "step": "Get your free piano buying guide" }
    ],
    "trustMessage": "Trusted by Dallas area piano families since 1985 - Your Premier Piano Gallery",
    "benefits": [
      { "icon": "shield-check", "text": "Free comprehensive Piano Buying Guide (PDF)" },
      { "icon": "users", "text": "Personalized piano recommendations" },
      { "icon": "award", "text": "Exclusive offers and updates" }
    ],
    "formOptions": {
      "experienceLevels": [
        { "level": "Beginner" },
        { "level": "Intermediate" },
        { "level": "Advanced" },
        { "level": "Professional" }
      ],
      "pianoTypes": [
        { "type": "Acoustic Grand" },
        { "type": "Acoustic Upright" },
        { "type": "Digital Piano" },
        { "type": "Hybrid Piano" },
        { "type": "Not Sure" }
      ],
      "budgetRanges": [
        { "range": "Under $5,000" },
        { "range": "$5,000 - $15,000" },
        { "range": "$15,000 - $35,000" },
        { "range": "$35,000 - $75,000" },
        { "range": "$75,000+" }
      ],
      "primaryUses": [
        { "use": "Learning/Practice" },
        { "use": "Family Entertainment" },
        { "use": "Teaching" },
        { "use": "Performance" },
        { "use": "Recording/Studio" }
      ]
    },
    "seo": {
      "metaTitle": "Kawai Piano Gallery Dallas | Premier Piano Gallery Since 1985 | Dallas, TX",
      "metaDescription": "Dallas'\''s premier Kawai Piano Gallery since 1985. Explore acoustic & digital pianos at our Dallas Piano Gallery. Expert consultation & service.",
      "keywords": "Kawai pianos, Dallas Piano Gallery, Dallas piano gallery, acoustic pianos, digital pianos, piano showroom, Texas Piano Gallery, piano sales, piano consultation"
    }
  }'