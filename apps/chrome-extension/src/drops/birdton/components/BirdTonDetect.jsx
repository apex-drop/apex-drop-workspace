import BirdTonIcon from "../assets/images/icon.png?format=webp";

export default function BirdTonDetect() {
  return (
    <div className="flex flex-col items-center justify-center min-w-0 min-h-0 gap-4 p-4 grow">
      <img src={BirdTonIcon} alt="Blum Farmer" className="w-16 h-16" />
      <h3 className="font-bold text-center">Connecting...</h3>
      <p className="text-center text-black">
        Please reload the farmer if not connected
      </p>
    </div>
  );
}
