import Banner from '@/Components/Pages/Home/Banner/Banner';
import HomePolicy from '@/Components/Pages/Home/HomePolicy/HomePolicy';
import NewArrival from '@/Components/Pages/Home/NewArrival/NewArrival';
import Products from '@/Components/Pages/Home/Products/Products';
// import 'core-js'; //for self


export default function Home() {
  return (
    <div className=''>
      <Banner />
      <NewArrival />
      <Products />
      <HomePolicy />
    </div>
  );
}
