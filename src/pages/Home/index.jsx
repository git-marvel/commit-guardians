const githubToken = import.meta.env.VITE_GITHUB_TOKEN;
const COMMITS_PER_PAGE = 100;

const Home = () => {
  const handleRepoInfoSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const formJson = Object.fromEntries(formData.entries());
    const [organizationName, repositoryName] = [
      formJson.organizationName,
      formJson.repositoryName,
    ];

    const gitcommitResponse = await fetch(
      `https://api.github.com/repos/${organizationName}/${repositoryName}/commits?per_page=${COMMITS_PER_PAGE}&page=1`,
      {
        headers: {
          Authorization: `token ${githubToken}`,
        },
      }
    );
    const gitcommitFirstPage = await gitcommitResponse.json();

    const linkHeader = gitcommitResponse.headers.get("Link");
    const lastPageNumber = linkHeader
      ? parseInt(linkHeader.match(/&page=(\d+)>; rel="last"/)?.[1])
      : 1;

    const allCommits = gitcommitFirstPage;

    if (lastPageNumber > 1) {
      const fetchPromises = [];
      for (let page = 2; page <= lastPageNumber; page++) {
        fetchPromises.push(
          fetch(
            `https://api.github.com/repos/${organizationName}/${repositoryName}/commits?per_page=${COMMITS_PER_PAGE}&page=${page}`,
            {
              headers: {
                Authorization: `token ${githubToken}`,
              },
            }
          ).then((res) => res.json())
        );
      }

      allCommits.push((await Promise.all(fetchPromises)).flat());
    }
  };

  return (
    <form method="post" onSubmit={handleRepoInfoSubmit}>
      <label>
        Organization name:{" "}
        <input name="organizationName" defaultValue="ex) facebook" />
        Repository name:{" "}
        <input name="repositoryName" defaultValue="ex) react" />
      </label>
      <button type="submit">git api 요청</button>
    </form>
  );
};

export default Home;
