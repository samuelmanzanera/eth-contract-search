const fs = require('fs')
const ethContractSearch = require('./index')

test('Get HTML page from searching', async () => {
    const html = await ethContractSearch.getHtmlPage("Hello");
    expect(html).toBeDefined()
})

test('Get contracts information from html', () => {
    const html = fs.readFileSync(__dirname + '/htmlExample.html')
    const contracts = ethContractSearch.getData(html)
    expect(contracts).toBeDefined()
    expect(contracts.length).toBeGreaterThan(0)
})

test('Get pagination from html', () => {
    const html = fs.readFileSync(__dirname + '/htmlExample.html')
    const pagination = ethContractSearch.getPagination(html)
    expect(pagination).toBeDefined()
    expect(pagination.next).toBeDefined()
    expect(pagination.last).toBeDefined()
    expect(pagination.next).toBe('2')
    expect(pagination.last).toBe('502')
})

test('Get results from searching', async () => {
    const results = await ethContractSearch.query('DAO')
    expect(results).toBeDefined()
    expect(results.data).toBeDefined()
    expect(results.data.length).toBeGreaterThan(0)
    expect(results.pagination).toBeDefined()
    expect(results.pagination.next).toBeDefined()
    expect(results.pagination.next).toBe('2')
})

test('Extract page number from href', () => {
    const pageNumber = ethContractSearch.extractPageNumberFromHref('/contractsVerified/502?cn=a')
    expect(pageNumber).toBe("502")
})

test('Get results from pagination', async () => {
    const results = await ethContractSearch.query('DAO', 2)
    expect(results).toBeDefined()
    expect(results.data).toBeDefined()
    expect(results.data.length).toBeGreaterThan(0)
    expect(results.pagination).toBeDefined()
    expect(results.pagination.next).toBeDefined()
    expect(results.pagination.next).toBe('3')
})

