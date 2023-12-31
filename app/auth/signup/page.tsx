import RegisterForm from '@/components/forms/register/register-form';
import { RegisterFormVariant } from '@/consts/enums';
import { checkAuth } from '@/lib/utils';

async function Signup() {
  await checkAuth({ forApp: true });

  return (
    <main>
      <div className="container flex min-h-screen items-center justify-center">
        <RegisterForm variant={RegisterFormVariant.Signup} />
      </div>
    </main>
  );
}

export default Signup;
