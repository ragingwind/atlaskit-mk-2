import WikiMarkupTransformer from '../../../index';

describe('JIRA wiki markup - Block Card', () => {
  const testCases: Array<[string, string]> = [
    [
      'should create Block Card between lines of text',
      `line 1 
      [http://...|http://...|block-link]
      line 2 `,
    ],
    [
      'should create Block Card with nothing else in the document',
      `[http://...|http://...|block-link]`,
    ],
    [
      'should create Block Card with whitespace on the same line',
      ` [http://...|http://...|block-link] 
      [http://...|http://...|block-link]`,
    ],
    [
      'should create Block Card if preceded and followed by text', // This will result in the text being moved to another line
      `
      abc [http://...|http://...|block-link] def
      `,
    ],
    [
      'should create Block Cards in table',
      `|[http://...|http://...|block-link]|`,
    ],
    [
      'should create Block Cards in panel', // Block ends up outside of the panel in adf
      `|{panel:bgColor=#deebff}test [http://...|http://...|block-link] test{panel}|`,
    ],
    [
      'should recover existing Block Cards',
      `|{adf:display=block}
      {"type":"blockCard","attrs":{"url":"https://aolrich-automation.atlassian.net/browse/SOF-1"}}
      {adf}|{adf:display=block}
      {"type":"blockCard","attrs":{"url":"https://aolrich-automation.atlassian.net/browse/SOF-1"}}
      {adf}|
      [https://aolrich-automation.atlassian.net/browse/SOF-1|https://aolrich-automation.atlassian.net/browse/SOF-1|block-link]`,
    ],
  ];

  for (const [testCaseDescription, markup] of testCases) {
    it(testCaseDescription, () => {
      const transformer = new WikiMarkupTransformer();
      expect(transformer.parse(markup)).toMatchSnapshot();
    });
  }
});