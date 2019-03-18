/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import styled from 'styled-components';

import chrome from 'ui/chrome';
import { MainRouteParams } from '../../common/types';
import { RootState } from '../../reducers';
import { ShortcutsProvider } from '../shortcuts';
import { Content } from './content';
import { SideTabs } from './side_tabs';

const Root = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex-grow: 1;
`;

interface Props extends RouteComponentProps<MainRouteParams> {
  loadingFileTree: boolean;
  loadingStructureTree: boolean;
}

class CodeMain extends React.Component<Props> {
  public componentDidMount() {
    this.setBreadcrumbs();
  }

  public componentDidUpdate() {
    chrome.breadcrumbs.pop();
    chrome.breadcrumbs.pop();
    this.setBreadcrumbs();
  }

  public setBreadcrumbs() {
    const { resource, org, repo } = this.props.match.params;
    chrome.breadcrumbs.push({
      text: `${org} → ${repo}`,
      href: `#/${resource}/${org}/${repo}`,
      // @ts-ignore
      className: 'code-no-max-width',
    });
    chrome.breadcrumbs.push({ text: '' });
  }

  public componentWillUnmount() {
    chrome.breadcrumbs.pop();
    chrome.breadcrumbs.pop();
    chrome.breadcrumbs.push({ text: '' });
  }

  public render() {
    const { loadingFileTree, loadingStructureTree } = this.props;
    return (
      <Root>
        <Container>
          <React.Fragment>
            <SideTabs
              loadingFileTree={loadingFileTree}
              loadingStructureTree={loadingStructureTree}
            />
            <Content />
          </React.Fragment>
        </Container>
        <ShortcutsProvider />
      </Root>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  loadingFileTree: state.file.loading,
  loadingStructureTree: state.symbol.loading,
});

export const Main = connect(
  mapStateToProps
  // @ts-ignore
)(CodeMain);
