// Escape user input before building a regex to prevent ReDoS / injection.
const escapeRegex = (str) => String(str).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    const keyword = this.queryStr.keyword
      ? {
          $or: [
            { title: { $regex: escapeRegex(this.queryStr.keyword), $options: "i" } },
            { skills: { $regex: escapeRegex(this.queryStr.keyword), $options: "i" } },
            { location: { $regex: escapeRegex(this.queryStr.keyword), $options: "i" } },
          ],
        }
      : {};
    this.query = this.query.find({ ...keyword });
    return this;
  }

  filter() {
    const queryCopy = { ...this.queryStr };
    ["keyword", "page", "limit", "sort"].forEach((k) => delete queryCopy[k]);

    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (m) => `$${m}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.queryStr.sort) {
      this.query = this.query.sort(this.queryStr.sort.split(",").join(" "));
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  pagination(resultPerPage) {
    const page = Number(this.queryStr.page) || 1;
    const skip = resultPerPage * (page - 1);
    this.query = this.query.limit(resultPerPage).skip(skip);
    return this;
  }
}

export default ApiFeatures;
