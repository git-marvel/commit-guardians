const FILTER_TYPE_LIST = new Map([
  ["remove", true],
  ["removed", true],
  ["removes", true],
  ["delete", true],
  ["test", true],
  ["docs", true],
]);

const getCheckCommitList = (commitList) => {
  const getCommitType = (element) => element.commit.message.split(":")[0];
  const removeParentheses = (input) => input.replace(/\(.*\)$/, "");
  const filteredCommitList = commitList.filter((commit) =>
    FILTER_TYPE_LIST.has(removeParentheses(getCommitType(commit)))
  );

  return filteredCommitList.map((element) => {
    const { sha, url, commit } = element;
    const { author, message } = commit;

    return {
      sha,
      url,
      author,
      message,
    };
  });
};

export { getCheckCommitList };
