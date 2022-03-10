import { css } from '@emotion/css';
import {
  DataSourceJsonData,
  DataSourceInstanceSettings,
  DataSourcePluginOptionsEditorProps,
  GrafanaTheme,
  KeyValue,
  updateDatasourcePluginJsonDataOption,
} from '@grafana/data';
import { DataSourcePicker } from '@grafana/runtime';
import { InlineField, InlineFieldRow, Input, TagsInput, useStyles, InlineSwitch } from '@grafana/ui';
import React from 'react';
import KeyValueInput from './KeyValueInput';

export interface TraceToLogsOptions {
  datasourceUid?: string;
  tags?: string[];
  mappedTags?: Array<KeyValue<string>>;
  mapTagNamesEnabled?: boolean;
  spanStartTimeShift?: string;
  spanEndTimeShift?: string;
  filterByTraceID?: boolean;
  filterBySpanID?: boolean;
  lokiSearch?: boolean; // legacy
}

export interface TraceToLogsData extends DataSourceJsonData {
  tracesToLogs?: TraceToLogsOptions;
  lokiSearch?: TraceToLogsOptions;
}

interface Props extends DataSourcePluginOptionsEditorProps<TraceToLogsData> {}

export function TraceToLogsSettings({ options, onOptionsChange }: Props) {
  const handleChange = (datasource: DataSourceInstanceSettings, searchType: keyof TraceToLogsData) => {
    updateDatasourcePluginJsonDataOption({ onOptionsChange, options }, searchType, {
      datasourceUid: datasource.uid,
      tags: options.jsonData.tracesToLogs?.tags,
    });
  };

  const styles = useStyles(getStyles);

  return (
    <div className={css({ width: '100%' })}>
      <h3 className="page-heading">Trace to logs</h3>

      <div className={styles.infoText}>
        Trace to logs lets you navigate from a trace span to the selected data source&apos;s log.
      </div>

      <InlineFieldRow>
        <InlineField
          tooltip="The data source the trace is going to navigate to"
          label="Tempo Search data source"
          labelWidth={26}
        >
          <DataSourcePicker
            inputId="trace-to-logs-data-source-picker"
            name="tracesToLogs"
            // pluginId={['loki', 'splunk']}
            logs
            current={options.jsonData.tracesToLogs?.datasourceUid}
            noDefault={true}
            width={40}
            onChange={(ds: DataSourceInstanceSettings) => handleChange(ds, 'tracesToLogs')}
          />
        </InlineField>
      </InlineFieldRow>

      <InlineFieldRow>
        <InlineField
          tooltip="The data source the trace is going to navigate to"
          label="Loki Search data source"
          labelWidth={26}
        >
          <DataSourcePicker
            inputId="loki-search-data-source-picker"
            name="lokiSearch"
            pluginId="loki"
            logs
            current={options.jsonData.lokiSearch?.datasourceUid}
            autoFocus
            width={40}
            onChange={(ds: DataSourceInstanceSettings) => handleChange(ds, 'lokiSearch')}
          />
        </InlineField>
      </InlineFieldRow>

      {options.jsonData.tracesToLogs?.mapTagNamesEnabled ? (
        <InlineFieldRow>
          <InlineField
            tooltip="Tags that will be used in the Loki query. Default tags: 'cluster', 'hostname', 'namespace', 'pod'"
            label="Tags"
            labelWidth={26}
          >
            <KeyValueInput
              keyPlaceholder="Tag"
              values={
                options.jsonData.tracesToLogs?.mappedTags ??
                options.jsonData.tracesToLogs?.tags?.map((tag) => ({ key: tag })) ??
                []
              }
              onChange={(v) =>
                updateDatasourcePluginJsonDataOption({ onOptionsChange, options }, 'tracesToLogs', {
                  ...options.jsonData.tracesToLogs,
                  mappedTags: v,
                })
              }
            />
          </InlineField>
        </InlineFieldRow>
      ) : (
        <InlineFieldRow>
          <InlineField
            tooltip="Tags that will be used in the Loki query. Default tags: 'cluster', 'hostname', 'namespace', 'pod'"
            label="Tags"
            labelWidth={26}
          >
            <TagsInput
              tags={options.jsonData.tracesToLogs?.tags}
              width={40}
              onChange={(tags) =>
                updateDatasourcePluginJsonDataOption({ onOptionsChange, options }, 'tracesToLogs', {
                  ...options.jsonData.tracesToLogs,
                  tags: tags,
                })
              }
            />
          </InlineField>
        </InlineFieldRow>
      )}

      <InlineFieldRow>
        <InlineField
          label="Map tag names"
          labelWidth={26}
          grow
          tooltip="Map trace tag names to log label names. Ex: k8s.pod.name -> pod"
        >
          <InlineSwitch
            id="mapTagNames"
            value={options.jsonData.tracesToLogs?.mapTagNamesEnabled ?? false}
            onChange={(event: React.SyntheticEvent<HTMLInputElement>) =>
              updateDatasourcePluginJsonDataOption({ onOptionsChange, options }, 'tracesToLogs', {
                ...options.jsonData.tracesToLogs,
                mapTagNamesEnabled: event.currentTarget.checked,
              })
            }
          />
        </InlineField>
      </InlineFieldRow>

      <InlineFieldRow>
        <InlineField
          label="Span start time shift"
          labelWidth={26}
          grow
          tooltip="Shifts the start time of the span. Default 0 (Time units can be used here, for example: 5s, 1m, 3h)"
        >
          <Input
            type="text"
            placeholder="1h"
            width={40}
            onChange={(v) =>
              updateDatasourcePluginJsonDataOption({ onOptionsChange, options }, 'tracesToLogs', {
                ...options.jsonData.tracesToLogs,
                spanStartTimeShift: v.currentTarget.value,
              })
            }
            value={options.jsonData.tracesToLogs?.spanStartTimeShift || ''}
          />
        </InlineField>
      </InlineFieldRow>

      <InlineFieldRow>
        <InlineField
          label="Span end time shift"
          labelWidth={26}
          grow
          tooltip="Shifts the end time of the span. Default 0 Time units can be used here, for example: 5s, 1m, 3h"
        >
          <Input
            type="text"
            placeholder="1h"
            width={40}
            onChange={(v) =>
              updateDatasourcePluginJsonDataOption({ onOptionsChange, options }, 'tracesToLogs', {
                ...options.jsonData.tracesToLogs,
                spanEndTimeShift: v.currentTarget.value,
              })
            }
            value={options.jsonData.tracesToLogs?.spanEndTimeShift || ''}
          />
        </InlineField>
      </InlineFieldRow>

      <InlineFieldRow>
        <InlineField
          label="Filter by Trace ID"
          labelWidth={26}
          grow
          tooltip="Filters logs by Trace ID. Appends '|=<trace id>' to the query."
        >
          <InlineSwitch
            id="filterByTraceID"
            value={options.jsonData.tracesToLogs?.filterByTraceID}
            onChange={(event: React.SyntheticEvent<HTMLInputElement>) =>
              updateDatasourcePluginJsonDataOption({ onOptionsChange, options }, 'tracesToLogs', {
                ...options.jsonData.tracesToLogs,
                filterByTraceID: event.currentTarget.checked,
              })
            }
          />
        </InlineField>
      </InlineFieldRow>

      <InlineFieldRow>
        <InlineField
          label="Filter by Span ID"
          labelWidth={26}
          grow
          tooltip="Filters logs by Span ID. Appends '|=<span id>' to the query."
        >
          <InlineSwitch
            id="filterBySpanID"
            value={options.jsonData.tracesToLogs?.filterBySpanID}
            onChange={(event: React.SyntheticEvent<HTMLInputElement>) =>
              updateDatasourcePluginJsonDataOption({ onOptionsChange, options }, 'tracesToLogs', {
                ...options.jsonData.tracesToLogs,
                filterBySpanID: event.currentTarget.checked,
              })
            }
          />
        </InlineField>
      </InlineFieldRow>
    </div>
  );
}

const getStyles = (theme: GrafanaTheme) => ({
  infoText: css`
    padding-bottom: ${theme.spacing.md};
    color: ${theme.colors.textSemiWeak};
  `,
});
