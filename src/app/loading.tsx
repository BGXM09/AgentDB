export default function Loading() {
  return <main className="container page-content route-loading" aria-label="Loading page">
    <div className="loading-line loading-title" />
    <div className="loading-line loading-search" />
    <div className="loading-list">{Array.from({ length: 5 }, (_, index) => <div className="loading-row" key={index} />)}</div>
  </main>;
}
