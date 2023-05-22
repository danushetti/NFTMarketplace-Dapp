import '../styles/globals.css'
import Link from 'next/link';

function MyApp({ Component, pageProps }) {
  return (
    <div>
    <nav className='border-b p-6'>
      <p className='text-4xl font-bold'>Metaverse NFT Store</p>
      <div className='flex mt-4'></div>
      <Link href='/'>
        <a className='mr-4 text-pink-500 hover:text-white'>Home</a>
      </Link>
      <Link href='/create-nft'>
        <a className='mr-6 text-pink-500 hover:text-white'>Sell NFT</a>
      </Link>
      <Link href='/my-nfts'>
        <a className='mr-4 text-pink-500 hover:text-white'>My NFT</a>
      </Link>
      <Link href='/creator-dashboard'>
        <a className='mr-4 text-pink-500 hover:text-white'>Dashboard</a>
      </Link>

    </nav>
   <Component {...pageProps} />
    </div>
  );
}

export default MyApp