const imgCone012 = "https://images.unsplash.com/photo-1728741517403-58e7f08280de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvcmZ1bCUyMDNEJTIwY29uZSUyMGdlb21ldHJpYyUyMHNoYXBlJTIwZGFyayUyMGJhY2tncm91bmR8ZW58MXx8fHwxNzcyNzQ1NzE1fDA&ixlib=rb-4.1.0&q=80&w=1080";

export default function Cone() {
  return (
    <div className="relative size-full" data-name="Cone">
      <div className="absolute inset-[-0.22%_0.56%_-0.28%_-1.05%]" data-name="Cone_01 2">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgCone012} />
      </div>
    </div>
  );
}
