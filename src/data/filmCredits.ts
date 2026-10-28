export type CastCredit = {
  type: 'Cast'
  name: string
  character: string
  instagramId: string
  instagramUrl: string
  imageUrl: string
}

export type CrewCredit = {
  type: 'Crew'
  name: string
  role: string
  instagramId: string
  instagramUrl: string
  imageUrl: string
}

export type FilmCredit = CastCredit | CrewCredit

export const filmCredits: FilmCredit[] = [
  {
    type: 'Cast',
    name: 'Dhruv Sharma',
    character: 'Reyansh',
    instagramId: '@fusiononinsta',
    instagramUrl: 'https://www.instagram.com/fusiononinsta/',
    imageUrl: 'https://raw.githubusercontent.com/dsframeworks/iamhereshortfilm/main/public/media/Dhruv-Sharma.jpg',
  },
  {
    type: 'Cast',
    name: 'Anshika Thapa',
    character: 'ASL Teacher',
    instagramId: '@lawanxx_',
    instagramUrl: 'https://www.instagram.com/lawanxx_/',
    imageUrl: '',
  },
  {
    type: 'Crew',
    name: 'Dhruv Sharma',
    role: 'Writter & Director',
    instagramId: '@fusiononinsta',
    instagramUrl: 'https://www.instagram.com/fusiononinsta/',
    imageUrl: 'https://raw.githubusercontent.com/dsframeworks/iamhereshortfilm/main/public/media/Dhruv-Sharma.jpg',
  },
  {
    type: 'Crew',
    // Ambiguous in the supplied data; preserve exactly until the owner confirms.
    name: 'Director of Photography',
    role: 'Aditya Rajput',
    instagramId: '@btw.adityya',
    instagramUrl: 'https://www.instagram.com/btw.adityya/',
    imageUrl: '',
  },
  {
    type: 'Crew',
    name: 'Jayesh Soni',
    role: 'Director of Photography',
    instagramId: '@jayesh_think',
    instagramUrl: 'https://www.instagram.com/jayesh_think/',
    imageUrl: 'https://raw.githubusercontent.com/dsframeworks/iamhereshortfilm/main/public/media/Jayesh-Soni.jpg',
  },
  {
    type: 'Crew',
    name: 'Aditya Rajput',
    role: 'Art Director',
    instagramId: '@btw.adityya',
    instagramUrl: 'https://www.instagram.com/btw.adityya/',
    imageUrl: '',
  },
]
