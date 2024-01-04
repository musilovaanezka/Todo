import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

const Home = () => {
  const token = cookies().get('token');

  if(!token) {
    redirect('/Login');
  } else {
    redirect("/TaskList");  
  }
}

export default Home