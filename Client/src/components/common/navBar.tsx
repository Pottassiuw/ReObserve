function NavBar() {
  return (
    <nav className="flex h-20 w-screen bg-slate-500">
      <div>
        <img src="../../assets/img.png" alt="image" />
        <h1>ReObserve</h1>
      </div>
      <div className="gap-10">
        <button className="p-3 border-2 border-teal-500">Cadastrar Empresa</button>
        <button className="p-3 border-2 border-teal-500">Logar Empresa</button>
      </div>
    </nav>
  );
}

export default NavBar;
