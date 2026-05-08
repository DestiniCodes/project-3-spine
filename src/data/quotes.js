// Loading screen quotes — rotating on every load
export const QUOTES = [
  { text: "A reader lives a thousand lives before he dies.", author: "George R.R. Martin" },
  { text: "There is no friend as loyal as a book.", author: "Ernest Hemingway" },
  { text: "One must always be careful of books, and what is inside them.", author: "Cassandra Clare" },
  { text: "Books are a uniquely portable magic.", author: "Stephen King" },
  { text: "If you only read the books that everyone else is reading, you can only think what everyone else is thinking.", author: "Haruki Murakami" },
  { text: "I am not afraid of storms, for I am learning how to sail my ship.", author: "Louisa May Alcott" },
  { text: "The more that you read, the more things you will know.", author: "Dr. Seuss" },
  { text: "A book is a dream you hold in your hands.", author: "Neil Gaiman" },
  { text: "Reading is the sole means by which we slip, involuntarily, often helplessly, into another's skin.", author: "Joyce Carol Oates" },
  { text: "Until I feared I would lose it, I never loved to read. One does not love breathing.", author: "Harper Lee" },
  { text: "It is what you read when you don't have to that determines what you will be when you can't help it.", author: "Oscar Wilde" },
  { text: "I took a deep breath and listened to the old brag of my heart: I am, I am, I am.", author: "Sylvia Plath" },
  { text: "Tis the good reader that makes the good book.", author: "Ralph Waldo Emerson" },
  { text: "You can never get a cup of tea large enough or a book long enough to suit me.", author: "C.S. Lewis" },
  { text: "A book must be the axe for the frozen sea within us.", author: "Franz Kafka" },
];

export const randomQuote = () => QUOTES[Math.floor(Math.random() * QUOTES.length)];
