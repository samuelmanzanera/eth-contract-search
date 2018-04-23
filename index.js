const axios = require('axios')
const cheerio = require('cheerio');
const SEARCH_URI = "https://etherscan.io/contractsVerified"

class EthContractSearch {

    /**
     * Search contracts
     * @param {string} name Contract to search
     * @param {number} page Page number
     */
    async query (name, page) {
        const html = await this.getHtmlPage(name, page)
        const data = this.getData(html)
        const pagination = this.getPagination(html)
        return { data, pagination }
    }

    /**
     * Get HTML page from etherscan.io
     * @param {string} name Contract to search
     * @param {number} page Page number
     */
    async getHtmlPage (name, page) {
        const URI = page ? `${SEARCH_URI}/${page}` : SEARCH_URI
        const results = await axios.get(`${URI}?cn=${name}`)
        return results.data;
    }

    /**
     * Get contracts listing from a query on the website
     * @param {string} html Etherscan.io HTML page
     */
    getData(html) {
        const $ = cheerio.load(html)

        const results =  $('.profile table tbody tr').map(function () {
            let data = $(this)
            let td = data.children()

            return {
                address: td.find('.address-tag').eq(0).text(),
                name: td.eq(1).text(),
                compiler: td.eq(2).text(),
                balance: td.eq(3).text(),
                txCount: td.eq(4).text(),
                verificationDate: td.eq(6).text()
            }
        })
        return results.get()
    }

    /**
     * Get the pagination from a query on the website
     * @param {string} html Etherscan.io HTML page
     */
    getPagination (html) {
        const $ = cheerio.load(html)
        const header = $('.profile .row').eq(1)
        const paginationEl = header.children().eq(1).find('a')
        let pagination = {}

        if (paginationEl.eq(0).attr('href') !== '#') {
            pagination.first = this.extractPageNumberFromHref(paginationEl.eq(0).attr('href'))
        }
        if (paginationEl.eq(1).attr('href') !== '#') {
            pagination.prev = this.extractPageNumberFromHref(paginationEl.eq(1).attr('href'))
        }
        if (paginationEl.eq(2).attr('href') !== '#') {
            pagination.next = this.extractPageNumberFromHref(paginationEl.eq(2).attr('href'))
        }
        if (paginationEl.eq(3).attr('href') !== '#') {
            pagination.last = this.extractPageNumberFromHref(paginationEl.eq(3).attr('href'))
        }

        return pagination
    }

    /**
     * Extract the page number from a href
     * @param {string} href Pagination link from etherscan.io (i.e. '/contractsVerified/502?cn=a')
     */
    extractPageNumberFromHref (href) {
        const matches = href.match(/(\/contractsVerified\/)[0-9]+/g)
        if (!matches || matches.length !== 1) {
            return 0
        }
        const splittedUrlBySlash = matches[0].split('/')
        return splittedUrlBySlash[2]
    }
}

module.exports = new EthContractSearch()
