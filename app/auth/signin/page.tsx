import RegisterForm from '@/components/forms/register/register-form';
import { RegisterFormVariant } from '@/consts/enums';
import { checkAuth } from '@/lib/utils';

async function Signin() {
  await checkAuth({ forApp: true });

  return (
    <main>
      <div className="container flex min-h-screen items-center justify-center">
        <RegisterForm variant={RegisterFormVariant.Signin} />
      </div>
    </main>
  );
}

export default Signin;
