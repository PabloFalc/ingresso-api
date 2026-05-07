export function createEventPeriod() {
  const now = new Date();

  const inicioVenda = new Date(now);
  inicioVenda.setDate(inicioVenda.getDate() - 1);

  const fimVenda = new Date(now);
  fimVenda.setDate(fimVenda.getDate() + 30);

  const dataInicioEvento = new Date(now);
  dataInicioEvento.setDate(dataInicioEvento.getDate() + 40);
  dataInicioEvento.setHours(20, 0, 0, 0);

  const dataFimEvento = new Date(dataInicioEvento);
  dataFimEvento.setHours(dataFimEvento.getHours() + 4);

  return {
    inicioVenda: inicioVenda.toISOString(),
    fimVenda: fimVenda.toISOString(),
    dataInicioEvento: dataInicioEvento.toISOString(),
    dataFimEvento: dataFimEvento.toISOString(),
  };
}
