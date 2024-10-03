import { CgSpinner } from "react-icons/cg";
import { Suspense } from "react";
import { lazy } from "react";

const components = new Map();

const loader = (farmer) =>
  components.get(farmer) ||
  components
    .set(
      farmer,
      lazy(() => import(`@/drops/${farmer.toLowerCase()}/${farmer}.jsx`))
    )
    .get(farmer);

export default function Farmer({ farmer, ...props }) {
  const Component = loader(farmer);

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center grow">
          <CgSpinner className="w-5 h-5 mx-auto animate-spin" />
        </div>
      }
    >
      <Component {...props} />
    </Suspense>
  );
}
