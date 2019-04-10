const mediaViewerModule = require.requireActual(
  '../../../newgen/analytics/media-viewer',
);
const mediaViewerModalEventSpy = jest.fn();
const mockMediaViewer = {
  ...mediaViewerModule,
  mediaViewerModalEvent: mediaViewerModalEventSpy,
};
jest.mock('../../../newgen/analytics/media-viewer', () => mockMediaViewer);

import * as React from 'react';
import { mount } from 'enzyme';
import { Subject } from 'rxjs/Subject';
import Button from '@atlaskit/button';
import { FileItem, Identifier } from '@atlaskit/media-core';
import { KeyboardEventWithKeyCode } from '@atlaskit/media-test-helpers';
import { createContext } from '../_stubs';
import { Content } from '../../../newgen/content';
import { MediaViewer } from '../../../newgen/media-viewer';
import { CloseButtonWrapper } from '../../../newgen/styled';
import Header from '../../../newgen/header';
import { ItemSource } from '../../../newgen/domain';

function createFixture(items: Identifier[], identifier: Identifier) {
  const subject = new Subject<FileItem>();
  const context = createContext();
  const onClose = jest.fn();
  const itemSource: ItemSource = {
    kind: 'ARRAY',
    items,
  };
  const el = mount(
    <MediaViewer
      selectedItem={identifier}
      itemSource={itemSource}
      context={context}
      onClose={onClose}
    />,
  );
  return { subject, el, onClose };
}

describe('<MediaViewer />', () => {
  const identifier: Identifier = {
    id: 'some-id',
    occurrenceKey: 'some-custom-occurrence-key',
    mediaItemType: 'file',
  };

  it('should close Media Viewer on click', () => {
    const { el, onClose } = createFixture([identifier], identifier);
    el.find(Content).simulate('click');
    expect(onClose).toHaveBeenCalled();
  });

  it.skip('should close Media Viewer on ESC shortcut', () => {
    const { onClose } = createFixture([identifier], identifier);
    const e = new KeyboardEventWithKeyCode('keydown', {
      bubbles: true,
      cancelable: true,
      keyCode: 27,
    });
    document.dispatchEvent(e);
    expect(onClose).toHaveBeenCalled();
  });

  it('should not close Media Viewer when clicking on the Header', () => {
    const { el, onClose } = createFixture([identifier], identifier);
    el.find(Header).simulate('click');
    expect(onClose).not.toHaveBeenCalled();
  });

  it('should always render the close button', () => {
    const { el, onClose } = createFixture([identifier], identifier);

    expect(el.find(CloseButtonWrapper)).toHaveLength(1);
    el.find(CloseButtonWrapper)
      .find(Button)
      .simulate('click');
    expect(onClose).toHaveBeenCalled();
  });

  describe('Analytics', () => {
    it('should trigger the screen event when the component loads', () => {
      createFixture([identifier], identifier);
      expect(mediaViewerModalEventSpy).toHaveBeenCalled();
    });
  });
});