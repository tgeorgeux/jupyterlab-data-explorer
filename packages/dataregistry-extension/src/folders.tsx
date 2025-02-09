/**
 * @license BSD-3-Clause
 *
 * Copyright (c) 2019 Project Jupyter Contributors.
 * Distributed under the terms of the 3-Clause BSD License.
 */

import { JupyterFrontEndPlugin, JupyterLab } from '@jupyterlab/application';
import {
  Registry,
  folderDatasetsConverter,
  createFolderConverter
} from '@jupyterlab/dataregistry';
import { IFileBrowserFactory } from '@jupyterlab/filebrowser';
import { IRegistry } from '@jupyterlab/dataregistry-registry-extension';
import { Contents } from '@jupyterlab/services';

export default {
  activate,
  id: '@jupyterlab/dataregistry-extension:folders',
  requires: [IRegistry, IFileBrowserFactory],
  autoStart: true
} as JupyterFrontEndPlugin<void>;

function activate(
  _: JupyterLab,
  registry: Registry,
  fileBrowserFactory: IFileBrowserFactory
) {
  registry.addConverter(
    folderDatasetsConverter,
    // Inspired by filebrowser.model.FileBrowserModel._handleContents
    createFolderConverter(
      async path =>
        new Set(
          [
            ...(await fileBrowserFactory.defaultBrowser.model.manager.services.contents.get(
              // Remove trailing slace before querying
              path.slice(0, -1)
            )).content
          ].map((model: Contents.IModel) =>
            // Add trailing slash if this is a directory so that we know that.
            model.type === 'directory' ? `${model.name}/` : model.name
          )
        )
    )
  );
}
