
function SearchBox({ keyword, onChange, onSearch }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <input
        type="text"
        value={keyword}
        onChange={onChange}
        placeholder="Rechercher un produit..."
        className="border p-2 rounded flex-1"
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Rechercher
      </button>
    </form>
  );
}

export default SearchBox;

