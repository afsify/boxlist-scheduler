import PropTypes from "prop-types";
import { Card } from "antd";

function AuthCard({ children }) {
  return (
    <section className="min-h-screen flex items-center justify-center">
      <Card className="rounded-2xl shadow-md shadow-black max-w-md w-full py-8 px-6 m-1">
        <div>{children}</div>
      </Card>
    </section>
  );
}

AuthCard.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthCard;
