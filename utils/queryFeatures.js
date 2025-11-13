class QueryFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    // Filter by query parameters
    filter() {
        const queryObj = { ...this.queryString };
        const excludedFields = ['page', 'sort', 'limit', 'fields', 'search'];
        excludedFields.forEach(field => delete queryObj[field]);

        // Advanced filtering (gte, gt, lte, lt)
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }

    // Sort results
    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        } else {
            // Default sort by newest first
            this.query = this.query.sort('-createdAt');
        }
        return this;
    }

    // Limit fields in response
    limitFields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        } else {
            // Exclude __v field by default
            this.query = this.query.select('-__v');
        }
        return this;
    }

    // Paginate results
    paginate() {
        const page = parseInt(this.queryString.page, 10) || 1;
        const limit = parseInt(this.queryString.limit, 10) || 10;
        const skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);
        return this;
    }

    // Search functionality
    search() {
        if (this.queryString.search) {
            this.query = this.query.find({
                $text: { $search: this.queryString.search }
            });
        }
        return this;
    }
}

module.exports = QueryFeatures;
