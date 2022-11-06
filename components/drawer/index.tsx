type DrawerProps = {
  open: boolean;
};

const Drawer = ({ open }: DrawerProps) => {
  if (!open) return <></>;
  return (
    <section className="h-52 overflow-y-auto overscroll-none">
      <h2>drawer</h2>
    </section>
  );
};

export default Drawer;
