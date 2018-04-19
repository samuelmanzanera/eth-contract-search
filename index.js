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
        return results
    }

    /**
     * Get the pagination from a query on the website
     * @param {string} html Etherscan.io HTML page
     */
    getPagination (html) {
        const $ = cheerio.load(html)
        const header = $('.profile .row').eq(1)
        const pagination = header.children().eq(1).find('a')

        return { 
            first: pagination.eq(0).attr('href') !== '#' ? this.extractPageNumberFromHref(pagination.eq(0).attr('href')) : undefined,
            prev: pagination.eq(1).attr('href') !== '#' ? this.extractPageNumberFromHref(pagination.eq(1).attr('href')) : undefined,
            next: pagination.eq(2).attr('href') !== '#' ? this.extractPageNumberFromHref(pagination.eq(2).attr('href')) : undefined,
            last: pagination.eq(3).attr('href') !== '#' ? this.extractPageNumberFromHref(pagination.eq(3).attr('href')) : undefined,
        }
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
