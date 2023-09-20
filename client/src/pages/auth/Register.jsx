import useLocalState from "../../utils/localState";
import RegisterForm from '../../components/Forms/RegisterForm'
const Register = () => {
  const {
    alert,
    showAlert,
    loading,
    setLoading,
    success,
    setSuccess,
    hideAlert,
  } = useLocalState();

  return (
    <RegisterForm
      alert={alert}
      showAlert={showAlert}
      loading={loading}
      setLoading={setLoading}
      success={success}
      setSuccess={setSuccess}
      hideAlert={hideAlert}
    />
  );
};

export default Register;
