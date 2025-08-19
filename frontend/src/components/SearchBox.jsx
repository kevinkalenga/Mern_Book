function SearchBox({ keyword, setKeyword, onSearch }) {
  return (
    <form
      className="flex flex-col sm:flex-row items-center mb-4 w-full sm:w-auto"
      onSubmit={(e) => {
        e.preventDefault();
        onSearch();
      }}
    >
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Rechercher..."
        className="flex-1 px-4 py-2 border rounded-md mb-2 sm:mb-0 sm:mr-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Rechercher
      </button>
    </form>
  );
}

export default SearchBox;


