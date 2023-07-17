import axios from "axios";
import { showAlert } from "./alerts";

let stripe;
try {
  stripe = Stripe(
    "pk_test_51NNzSSFYGQu19TRzKsWiiNjkTmWSfA9W64PA33OnDBy5ftzCpGG1IhzuW6rkoJVcjOBItUxaL36hqNEMDptyGA1a00bWFwkx3q"
  );
} catch (e) {
  stripe = "";
}

export const buyLand = async (landId, LastChanged) => {
  try {
    // Get checkout session from the server
    console.log(LastChanged);
    const session = await axios.post(
      `/api/v1/purchase/checkout-session/${landId}`,
      {
        LastChanged: JSON.parse(LastChanged),
      }
    );

    console.log(session);
    // Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert("failure", err.response.data.message);
  }
};
