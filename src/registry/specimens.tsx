import type { ChangeEvent } from 'react'
import { useState } from 'react'
import { AIIngressButton } from '@workday/canvas-kit-labs-react/ai-ingress-button'
import { KBD } from '@workday/canvas-kit-labs-react/kbd'
import { ColorPicker } from '@workday/canvas-kit-preview-react/color-picker'
import { Divider } from '@workday/canvas-kit-preview-react/divider'
import { LoadingSparkles } from '@workday/canvas-kit-preview-react/loading-sparkles'
import { MultiSelect } from '@workday/canvas-kit-preview-react/multi-select'
import { RadioGroup } from '@workday/canvas-kit-preview-react/radio'
import { StatusIndicator } from '@workday/canvas-kit-preview-react/status-indicator'
import { Switch } from '@workday/canvas-kit-preview-react/switch'
import { Tabs } from '@workday/canvas-kit-preview-react/tabs'
import { ActionBar } from '@workday/canvas-kit-react/action-bar'
import { Avatar } from '@workday/canvas-kit-react/avatar'
import { CountBadge } from '@workday/canvas-kit-react/badge'
import { Banner } from '@workday/canvas-kit-react/banner'
import { Breadcrumbs } from '@workday/canvas-kit-react/breadcrumbs'
import {
  DeleteButton,
  ExternalHyperlink,
  Hyperlink,
  PrimaryButton,
  SecondaryButton,
  TertiaryButton,
} from '@workday/canvas-kit-react/button'
import { Card } from '@workday/canvas-kit-react/card'
import { Checkbox } from '@workday/canvas-kit-react/checkbox'
import { Combobox } from '@workday/canvas-kit-react/combobox'
import { AccessibleHide } from '@workday/canvas-kit-react/common'
import { Dialog } from '@workday/canvas-kit-react/dialog'
import { Expandable } from '@workday/canvas-kit-react/expandable'
import { FormField } from '@workday/canvas-kit-react/form-field'
import { SystemIcon } from '@workday/canvas-kit-react/icon'
import { InformationHighlight } from '@workday/canvas-kit-react/information-highlight'
import { Box, Flex, Grid } from '@workday/canvas-kit-react/layout'
import { LoadingDots } from '@workday/canvas-kit-react/loading-dots'
import { Menu } from '@workday/canvas-kit-react/menu'
import { Modal } from '@workday/canvas-kit-react/modal'
import { Pagination } from '@workday/canvas-kit-react/pagination'
import type { PaginationModel } from '@workday/canvas-kit-react/pagination'
import { Pill } from '@workday/canvas-kit-react/pill'
import { Popup } from '@workday/canvas-kit-react/popup'
import { SegmentedControl } from '@workday/canvas-kit-react/segmented-control'
import { Select } from '@workday/canvas-kit-react/select'
import {
  SidePanel,
  useSidePanelModel,
} from '@workday/canvas-kit-react/side-panel'
import { Skeleton } from '@workday/canvas-kit-react/skeleton'
import { Table } from '@workday/canvas-kit-react/table'
import { Text } from '@workday/canvas-kit-react/text'
import { TextArea } from '@workday/canvas-kit-react/text-area'
import { TextInput } from '@workday/canvas-kit-react/text-input'
import { Toast } from '@workday/canvas-kit-react/toast'
import { Tooltip } from '@workday/canvas-kit-react/tooltip'
import {
  checkIcon,
  exclamationCircleIcon,
  infoIcon,
} from '@workday/canvas-system-icons-web'
import { BRAND_ICONS } from '@/registry/brandIcon'
import type {
  CanvasKitEntry,
  CanvasKitSlug,
  CanvasKitSpecimen,
} from '@/registry/types'

import styles from './specimens.module.css'

const TEAMS = ['Design systems', 'Platform', 'Accessibility']
const REVIEWERS = ['Taka Shimokobe', 'Nor Savangovay', 'Rick Schaffer']
const ACCENT_SWATCHES = [
  '#0875E1',
  '#1A818C',
  '#217A37',
  '#C06C00',
  '#A31B12',
  '#7C3882',
  '#333333',
  '#FFFFFF',
]
const TOKEN_ROWS = [
  { token: 'surface-default', light: 'white', dark: 'dark-neutral-100' },
  { token: 'surface-popover', light: 'white', dark: 'dark-neutral-150' },
  { token: 'surface-modal', light: 'white', dark: 'dark-neutral-200' },
] as const

function Stage({ children }: { children: React.ReactNode }) {
  return (
    <Flex
      cs={{
        gap: 'var(--cnvs-base-size-200)',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'flex-start',
        inlineSize: '100%',
      }}
    >
      {children}
    </Flex>
  )
}

/** Vertical list of variant rows inside one specimen card. */
function Stack({ children }: { children: React.ReactNode }) {
  return (
    <Flex
      cs={{
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 'var(--cnvs-base-size-200)',
        inlineSize: '100%',
      }}
    >
      {children}
    </Flex>
  )
}

function FallbackSpecimen({ entry }: { entry: CanvasKitEntry }) {
  return (
    <div className={styles.Fallback}>
      <Text as="p" typeLevel="body.small">
        Interactive specimen coming soon. Import from:
      </Text>
      <code className={styles.Code}>{entry.importPath}</code>
      <a
        className={styles.StorybookLink}
        href={entry.storybookUrl}
        target="_blank"
        rel="noreferrer"
      >
        View in Canvas Kit Storybook
      </a>
    </div>
  )
}

function ActionBarSpecimen() {
  return (
    <ActionBar>
      <ActionBar.List
        cs={{
          position: 'relative',
          inset: 'unset',
          alignSelf: 'stretch',
        }}
      >
        <ActionBar.Item as={SecondaryButton}>Save draft</ActionBar.Item>
        <ActionBar.Item as={PrimaryButton}>Publish</ActionBar.Item>
      </ActionBar.List>
    </ActionBar>
  )
}

function AiIngressButtonSpecimen() {
  return <AIIngressButton>Ask AI</AIIngressButton>
}

function AvatarSpecimen() {
  return (
    <Stage>
      <Avatar name="Jordan Lee" size="extraSmall" />
      <Avatar name="Sam Rivera" />
      <Avatar name="Riley Chen" size="large" />
    </Stage>
  )
}

function BadgeSpecimen() {
  return (
    <Stage>
      <CountBadge count={3} />
      <CountBadge count={128} limit={99} />
    </Stage>
  )
}

function BannerSpecimen() {
  return (
    <Flex cs={{ flexDirection: 'column', gap: 'var(--cnvs-base-size-200)' }}>
      <Banner>
        <Banner.Icon />
        <Banner.Label>3 Alerts</Banner.Label>
        <Banner.ActionText>View more</Banner.ActionText>
      </Banner>
      <Banner hasError>
        <Banner.Icon />
        <Banner.Label>2 Errors</Banner.Label>
        <Banner.ActionText>View more</Banner.ActionText>
      </Banner>
    </Flex>
  )
}

function BoxSpecimen() {
  return (
    <Box
      cs={{
        padding: 'var(--cnvs-base-size-300)',
        backgroundColor: 'var(--cnvs-sys-color-surface-alt-default)',
        borderRadius: 'var(--cnvs-sys-shape-card)',
      }}
    >
      Box container
    </Box>
  )
}

function BreadcrumbsSpecimen() {
  return (
    <Breadcrumbs aria-label="Breadcrumbs">
      <Breadcrumbs.List>
        <Breadcrumbs.Item>
          <Breadcrumbs.Link href="#themes">Themes</Breadcrumbs.Link>
        </Breadcrumbs.Item>
        <Breadcrumbs.Item>
          <Breadcrumbs.Link href="#sana">Sana Canvas</Breadcrumbs.Link>
        </Breadcrumbs.Item>
        <Breadcrumbs.CurrentItem>1.4</Breadcrumbs.CurrentItem>
      </Breadcrumbs.List>
    </Breadcrumbs>
  )
}

function ButtonSpecimen() {
  return (
    <Stack>
      <Stage>
        <PrimaryButton>Primary</PrimaryButton>
        <SecondaryButton>Secondary</SecondaryButton>
        <TertiaryButton>Tertiary</TertiaryButton>
        <DeleteButton>Delete</DeleteButton>
      </Stage>
      <Stage>
        <PrimaryButton size="small">Small</PrimaryButton>
        <SecondaryButton size="small">Small</SecondaryButton>
        <PrimaryButton disabled>Disabled</PrimaryButton>
        <SecondaryButton disabled>Disabled</SecondaryButton>
      </Stage>
      <Stage>
        <Hyperlink href="#button">Inline link</Hyperlink>
        <ExternalHyperlink href="https://workday.github.io/canvas-kit/">
          Canvas Kit docs
        </ExternalHyperlink>
      </Stage>
    </Stack>
  )
}

function CardSpecimen() {
  return (
    <Card cs={{ maxWidth: '20rem' }}>
      <Card.Heading>Canvas Supreme</Card.Heading>
      <Card.Body>
        Pepperoni, sausage, bell peppers, mushrooms, onions, and oregano.
      </Card.Body>
    </Card>
  )
}

function CheckboxSpecimen() {
  const [digest, setDigest] = useState(true)
  const [mentions, setMentions] = useState(false)

  return (
    <Flex cs={{ flexDirection: 'column', gap: 'var(--cnvs-base-size-100)' }}>
      <Checkbox
        label="Weekly digest"
        checked={digest}
        onChange={() => setDigest(!digest)}
      />
      <Checkbox
        label="Mentions"
        checked={mentions}
        onChange={() => setMentions(!mentions)}
      />
      <Checkbox label="All updates" checked indeterminate onChange={() => {}} />
      <Checkbox label="Beta features" disabled onChange={() => {}} />
    </Flex>
  )
}

function ColorPickerSpecimen() {
  const [accent, setAccent] = useState('#0875E1')

  return (
    <ColorPicker
      value={accent}
      colorSet={ACCENT_SWATCHES}
      showCustomHexInput
      onColorChange={setAccent}
    />
  )
}

function ComboboxSpecimen() {
  return (
    <Combobox items={REVIEWERS}>
      <FormField grow cs={{ maxWidth: '20rem' }}>
        <FormField.Label>Search reviewer</FormField.Label>
        <FormField.Input as={Combobox.Input} />
        <Combobox.Menu.Popper>
          <Combobox.Menu.Card>
            <Combobox.Menu.List>
              {(item: string) => (
                <Combobox.Menu.Item>{item}</Combobox.Menu.Item>
              )}
            </Combobox.Menu.List>
          </Combobox.Menu.Card>
        </Combobox.Menu.Popper>
      </FormField>
    </Combobox>
  )
}

function DialogSpecimen() {
  return (
    <Dialog>
      <Dialog.Target as={SecondaryButton}>Confirm</Dialog.Target>
      <Dialog.Popper>
        <Dialog.Card>
          <Dialog.Heading>Publish 1.4?</Dialog.Heading>
          <Dialog.Body>Draft tokens become the live theme.</Dialog.Body>
          <Dialog.CloseButton>Not yet</Dialog.CloseButton>
        </Dialog.Card>
      </Dialog.Popper>
    </Dialog>
  )
}

function DividerSpecimen() {
  return (
    <Flex
      cs={{
        flexDirection: 'column',
        gap: 'var(--cnvs-base-size-200)',
        inlineSize: '100%',
        maxWidth: '20rem',
      }}
    >
      <Text as="p" typeLevel="body.small">
        Above the divider
      </Text>
      <Divider />
      <Text as="p" typeLevel="body.small">
        Below the divider
      </Text>
    </Flex>
  )
}

function ExpandableSpecimen() {
  return (
    <Expandable cs={{ maxWidth: '24rem' }}>
      <Expandable.Target headingLevel="h3">
        <Expandable.Title>What shipped</Expandable.Title>
        <Expandable.Icon iconPosition="end" />
      </Expandable.Target>
      <Expandable.Content>
        Elevated cards, quieter dark surfaces, and remapped bg-default.
      </Expandable.Content>
    </Expandable>
  )
}

function FlexSpecimen() {
  return (
    <Flex cs={{ gap: 'var(--cnvs-base-size-150)' }}>
      <Box
        cs={{
          padding: 'var(--cnvs-base-size-150)',
          backgroundColor: 'var(--cnvs-sys-color-surface-alt-default)',
        }}
      >
        One
      </Box>
      <Box
        cs={{
          padding: 'var(--cnvs-base-size-150)',
          backgroundColor: 'var(--cnvs-sys-color-surface-alt-default)',
        }}
      >
        Two
      </Box>
    </Flex>
  )
}

function FormFieldSpecimen() {
  const [value, setValue] = useState('Color foundations')

  return (
    <Flex
      cs={{
        flexDirection: 'column',
        gap: 'var(--cnvs-base-size-300)',
        inlineSize: '100%',
        maxWidth: '20rem',
      }}
    >
      <FormField grow>
        <FormField.Label>Course title</FormField.Label>
        <FormField.Input
          as={TextInput}
          value={value}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setValue(event.target.value)
          }
        />
        <FormField.Hint>Shown on the course card.</FormField.Hint>
      </FormField>
      <FormField grow error="error">
        <FormField.Label>Slug</FormField.Label>
        <FormField.Input
          as={TextInput}
          value="color foundations!"
          onChange={() => {}}
        />
        <FormField.Hint>Lowercase letters and dashes only.</FormField.Hint>
      </FormField>
    </Flex>
  )
}

function GridSpecimen() {
  return (
    <Grid
      cs={{
        gap: 'var(--cnvs-base-size-150)',
        gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
        inlineSize: '100%',
        maxWidth: '20rem',
      }}
    >
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <Box
          key={item}
          cs={{
            padding: 'var(--cnvs-base-size-150)',
            backgroundColor: 'var(--cnvs-sys-color-surface-alt-default)',
            textAlign: 'center',
          }}
        >
          {item}
        </Box>
      ))}
    </Grid>
  )
}

function InformationHighlightSpecimen() {
  return (
    <InformationHighlight
      variant="informational"
      emphasis="high"
      cs={{ maxWidth: '28rem' }}
    >
      <InformationHighlight.Icon
        icon={infoIcon}
        color="var(--cnvs-sys-color-fg-info-default)"
      />
      <InformationHighlight.Heading>Theme synced</InformationHighlight.Heading>
      <InformationHighlight.Body>
        Dark elevation uses surface-default, surface-popover, and surface-modal.
      </InformationHighlight.Body>
      <InformationHighlight.Link href="#dark-mode">
        View elevation tokens
      </InformationHighlight.Link>
    </InformationHighlight>
  )
}

function KbdSpecimen() {
  return (
    <Stack>
      <Stage>
        <KBD>
          <KBD.Item>⌘</KBD.Item>
          <KBD.Item>K</KBD.Item>
        </KBD>
        <KBD>
          <KBD.Item>Ctrl</KBD.Item>
          <KBD.Item>Shift</KBD.Item>
          <KBD.Item>P</KBD.Item>
        </KBD>
        <KBD variant="plain">
          <KBD.Item>⌘</KBD.Item>
          <KBD.Item>C</KBD.Item>
        </KBD>
      </Stage>
      <Stage>
        <KBD size="small">
          <KBD.Item>⌘</KBD.Item>
          <KBD.Item>S</KBD.Item>
        </KBD>
        <KBD size="medium">
          <KBD.Item>⌘</KBD.Item>
          <KBD.Item>S</KBD.Item>
        </KBD>
        <KBD size="large">
          <KBD.Item>⌘</KBD.Item>
          <KBD.Item>S</KBD.Item>
        </KBD>
      </Stage>
    </Stack>
  )
}

function LoadingDotsSpecimen() {
  return <LoadingDots />
}

function LoadingSparklesSpecimen() {
  return <LoadingSparkles aria-label="Generating" />
}

function MenuSpecimen() {
  return (
    <Menu>
      <Menu.Target as={SecondaryButton}>More</Menu.Target>
      <Menu.Popper>
        <Menu.Card>
          <Menu.List>
            <Menu.Item>Duplicate release</Menu.Item>
            <Menu.Item>Export CSS</Menu.Item>
            <Menu.Item>Archive</Menu.Item>
          </Menu.List>
        </Menu.Card>
      </Menu.Popper>
    </Menu>
  )
}

function ModalSpecimen() {
  return (
    <Modal>
      <Modal.Target as={SecondaryButton}>Review</Modal.Target>
      <Modal.Overlay>
        <Modal.Card>
          <Modal.Heading>Review changes</Modal.Heading>
          <Modal.Body>
            Three tokens differ from the last published theme.
          </Modal.Body>
          <Modal.CloseButton>Close</Modal.CloseButton>
        </Modal.Card>
      </Modal.Overlay>
    </Modal>
  )
}

function MultiSelectSpecimen() {
  return (
    <MultiSelect items={REVIEWERS}>
      <FormField grow cs={{ maxWidth: '20rem' }}>
        <FormField.Label>Approvers</FormField.Label>
        <FormField.Input as={MultiSelect.Input} />
        <MultiSelect.Popper>
          <MultiSelect.Card>
            <MultiSelect.List>
              {(item: string) => <MultiSelect.Item>{item}</MultiSelect.Item>}
            </MultiSelect.List>
          </MultiSelect.Card>
        </MultiSelect.Popper>
      </FormField>
    </MultiSelect>
  )
}

function PaginationSpecimen() {
  return (
    <Pagination aria-label="Token pages" lastPage={3} initialCurrentPage={1}>
      <Pagination.Controls>
        <Pagination.StepToPreviousButton aria-label="Previous" />
        <Pagination.PageList>
          {({ state }: PaginationModel) =>
            state.range.map((pageNumber) => (
              <Pagination.PageListItem key={pageNumber}>
                <Pagination.PageButton
                  aria-label={`Page ${pageNumber}`}
                  pageNumber={pageNumber}
                />
              </Pagination.PageListItem>
            ))
          }
        </Pagination.PageList>
        <Pagination.StepToNextButton aria-label="Next" />
      </Pagination.Controls>
    </Pagination>
  )
}

function PillSpecimen() {
  return (
    <Stage>
      <Pill onClick={() => {}}>
        <Pill.Label>Design tokens</Pill.Label>
        <Pill.Count>12</Pill.Count>
      </Pill>
      <Pill variant="removable">
        <Pill.Label>Canvas Kit</Pill.Label>
        <Pill.IconButton aria-label="Remove Canvas Kit" onClick={() => {}} />
      </Pill>
      <Pill variant="readOnly">Read only</Pill>
    </Stage>
  )
}

function PopupSpecimen() {
  return (
    <Popup>
      <Popup.Target as={SecondaryButton}>Share</Popup.Target>
      <Popup.Popper>
        <Popup.Card>
          <Popup.Heading>Share 1.4</Popup.Heading>
          <Popup.Body>Anyone with the link can preview this theme.</Popup.Body>
          <Popup.CloseButton>Copy link</Popup.CloseButton>
        </Popup.Card>
      </Popup.Popper>
    </Popup>
  )
}

function RadioSpecimen() {
  const [channel, setChannel] = useState('email')

  return (
    <FormField>
      <FormField.Label>Channel</FormField.Label>
      <RadioGroup
        name="channel"
        value={channel}
        onChange={(value) => setChannel(String(value))}
      >
        <RadioGroup.RadioButton value="email">Email</RadioGroup.RadioButton>
        <RadioGroup.RadioButton value="slack">Slack</RadioGroup.RadioButton>
        <RadioGroup.RadioButton value="sms" disabled>
          SMS
        </RadioGroup.RadioButton>
      </RadioGroup>
    </FormField>
  )
}

function SegmentedControlSpecimen() {
  return (
    <Stack>
      <SegmentedControl>
        <SegmentedControl.List aria-label="Activity range">
          <SegmentedControl.Item data-id="day">Day</SegmentedControl.Item>
          <SegmentedControl.Item data-id="week">Week</SegmentedControl.Item>
          <SegmentedControl.Item data-id="month">Month</SegmentedControl.Item>
        </SegmentedControl.List>
      </SegmentedControl>
      <SegmentedControl size="small">
        <SegmentedControl.List aria-label="Density">
          <SegmentedControl.Item data-id="cozy">Cozy</SegmentedControl.Item>
          <SegmentedControl.Item data-id="compact">
            Compact
          </SegmentedControl.Item>
        </SegmentedControl.List>
      </SegmentedControl>
    </Stack>
  )
}

function SelectSpecimen() {
  return (
    <Select items={TEAMS}>
      <FormField grow cs={{ maxWidth: '20rem' }}>
        <FormField.Label>Owning team</FormField.Label>
        <FormField.Input as={Select.Input} />
        <Select.Popper>
          <Select.Card>
            <Select.List>
              {(item: string) => <Select.Item>{item}</Select.Item>}
            </Select.List>
          </Select.Card>
        </Select.Popper>
      </FormField>
    </Select>
  )
}

function SidePanelSpecimen() {
  const model = useSidePanelModel()
  const expanded =
    model.state.transitionState === 'expanded' ||
    model.state.transitionState === 'expanding'

  return (
    <Flex
      cs={{
        minBlockSize: '14rem',
        inlineSize: '100%',
        border: '1px solid var(--cnvs-sys-color-border-default)',
        borderRadius: 'var(--cnvs-sys-shape-card)',
        overflow: 'hidden',
        backgroundColor: 'var(--cnvs-sys-color-bg-alt-default)',
      }}
    >
      <SidePanel
        model={model}
        variant="alternative"
        expandedWidth={200}
        collapsedWidth={64}
      >
        <AccessibleHide id={model.state.labelId}>Navigation</AccessibleHide>
        {expanded && (
          <Flex
            cs={{
              alignItems: 'center',
              justifyContent: 'center',
              inlineSize: '2.625rem',
              blockSize: '2.625rem',
              margin: 'var(--cnvs-base-size-100)',
              border: '1px solid var(--cnvs-sys-color-border-default)',
              borderRadius: 'var(--cnvs-sys-shape-md)',
            }}
          >
            <SystemIcon icon={BRAND_ICONS.workday} size={24} />
          </Flex>
        )}
        {/* Defaults to sidebarLeftIcon for start-origin panels. */}
        <SidePanel.ToggleButton
          tooltipText="Toggle navigation"
          style={{ insetBlockStart: '0.5625rem' }}
        />
      </SidePanel>
      <Box cs={{ padding: 'var(--cnvs-base-size-300)', flex: 1 }}>
        <Text as="p" typeLevel="body.small">
          Main content sits beside the panel.
        </Text>
      </Box>
    </Flex>
  )
}

function SkeletonSpecimen() {
  return (
    <Box cs={{ inlineSize: '100%', maxWidth: '20rem' }}>
      <Skeleton>
        <Flex cs={{ gap: 'var(--cnvs-base-size-200)' }}>
          <Skeleton.Shape width="2.5rem" height="2.5rem" borderRadius="50%" />
          <Box cs={{ flex: 1 }}>
            <Skeleton.Header />
            <Skeleton.Text lineCount={2} />
          </Box>
        </Flex>
      </Skeleton>
    </Box>
  )
}

function StatusIndicatorSpecimen() {
  return (
    <Stack>
      <Stage>
        <StatusIndicator emphasis="low" variant="neutral">
          <StatusIndicator.Label>Draft</StatusIndicator.Label>
        </StatusIndicator>
        <StatusIndicator emphasis="low" variant="info">
          <StatusIndicator.Label>In review</StatusIndicator.Label>
        </StatusIndicator>
        <StatusIndicator emphasis="low" variant="positive">
          <StatusIndicator.Label>Published</StatusIndicator.Label>
        </StatusIndicator>
        <StatusIndicator emphasis="low" variant="caution">
          <StatusIndicator.Label>Expiring</StatusIndicator.Label>
        </StatusIndicator>
        <StatusIndicator emphasis="low" variant="critical">
          <StatusIndicator.Label>Blocked</StatusIndicator.Label>
        </StatusIndicator>
      </Stage>
      <Stage>
        <StatusIndicator emphasis="high" variant="neutral">
          <StatusIndicator.Label>Draft</StatusIndicator.Label>
        </StatusIndicator>
        <StatusIndicator emphasis="high" variant="info">
          <StatusIndicator.Label>In review</StatusIndicator.Label>
        </StatusIndicator>
        <StatusIndicator emphasis="high" variant="positive">
          <StatusIndicator.Label>Published</StatusIndicator.Label>
        </StatusIndicator>
        <StatusIndicator emphasis="high" variant="caution">
          <StatusIndicator.Label>Expiring</StatusIndicator.Label>
        </StatusIndicator>
        <StatusIndicator emphasis="high" variant="critical">
          <StatusIndicator.Label>Blocked</StatusIndicator.Label>
        </StatusIndicator>
      </Stage>
    </Stack>
  )
}

function SwitchSpecimen() {
  const [notifications, setNotifications] = useState(true)
  const [autoPublish, setAutoPublish] = useState(false)

  return (
    <Flex cs={{ flexDirection: 'column', gap: 'var(--cnvs-base-size-100)' }}>
      <FormField orientation="horizontalStart">
        <FormField.Label>Notifications</FormField.Label>
        <FormField.Input
          as={Switch}
          checked={notifications}
          onChange={() => setNotifications(!notifications)}
        />
      </FormField>
      <FormField orientation="horizontalStart">
        <FormField.Label>Auto-publish</FormField.Label>
        <FormField.Input
          as={Switch}
          checked={autoPublish}
          onChange={() => setAutoPublish(!autoPublish)}
        />
      </FormField>
      <FormField orientation="horizontalStart">
        <FormField.Label>Legacy mode</FormField.Label>
        <FormField.Input
          as={Switch}
          disabled
          checked={false}
          onChange={() => {}}
        />
      </FormField>
    </Flex>
  )
}

function TableSpecimen() {
  return (
    <Table>
      <Table.Head>
        <Table.Row>
          <Table.Header>Token</Table.Header>
          <Table.Header>Light</Table.Header>
          <Table.Header>Dark</Table.Header>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {TOKEN_ROWS.map((row) => (
          <Table.Row key={row.token}>
            <Table.Cell>{row.token}</Table.Cell>
            <Table.Cell>{row.light}</Table.Cell>
            <Table.Cell>{row.dark}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  )
}

function TabsSpecimen() {
  return (
    <Tabs>
      <Tabs.List>
        <Tabs.Item data-id="overview">Overview</Tabs.Item>
        <Tabs.Item data-id="tokens">Tokens</Tabs.Item>
        <Tabs.Item data-id="components">Components</Tabs.Item>
        <Tabs.Item data-id="activity">Activity</Tabs.Item>
        <Tabs.Item data-id="settings">Settings</Tabs.Item>
      </Tabs.List>
      <Tabs.Panel data-id="overview">
        <Text as="p" typeLevel="body.small">
          Release notes and token diffs.
        </Text>
      </Tabs.Panel>
      <Tabs.Panel data-id="tokens">
        <Text as="p" typeLevel="body.small">
          Color, type, and depth token tables.
        </Text>
      </Tabs.Panel>
      <Tabs.Panel data-id="components">
        <Text as="p" typeLevel="body.small">
          Component coverage and overrides.
        </Text>
      </Tabs.Panel>
      <Tabs.Panel data-id="activity">
        <Text as="p" typeLevel="body.small">
          Recent publishes and reviews.
        </Text>
      </Tabs.Panel>
      <Tabs.Panel data-id="settings">
        <Text as="p" typeLevel="body.small">
          Theme scope and publish targets.
        </Text>
      </Tabs.Panel>
    </Tabs>
  )
}

function TextSpecimen() {
  return (
    <Flex cs={{ flexDirection: 'column', gap: 'var(--cnvs-base-size-100)' }}>
      <Text as="p" typeLevel="heading.medium">
        Heading medium
      </Text>
      <Text as="p" typeLevel="body.medium">
        Body medium — default reading size.
      </Text>
      <Text as="p" typeLevel="subtext.large">
        Subtext large
      </Text>
    </Flex>
  )
}

function TextAreaSpecimen() {
  const [value, setValue] = useState('Multi-line text area content.')

  return (
    <TextArea
      value={value}
      onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
        setValue(event.target.value)
      }
      style={{ minWidth: '20rem' }}
    />
  )
}

function TextInputSpecimen() {
  const [value, setValue] = useState('Canvas Kit')

  return (
    <Flex
      cs={{
        flexDirection: 'column',
        gap: 'var(--cnvs-base-size-150)',
        inlineSize: '100%',
        maxWidth: '20rem',
      }}
    >
      <TextInput
        aria-label="Theme name"
        value={value}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          setValue(event.target.value)
        }
      />
      <TextInput aria-label="Search tokens" placeholder="Search tokens" />
      <TextInput
        aria-label="Locked value"
        value="neutral-600"
        disabled
        onChange={() => {}}
      />
    </Flex>
  )
}

function ToastSpecimen() {
  return (
    <Stack>
      <Toast mode="status">
        <Toast.Icon
          icon={checkIcon}
          color="var(--cnvs-sys-color-fg-success-default)"
        />
        <Toast.Body>
          <Toast.Message>Sana Canvas 1.4 is ready to publish.</Toast.Message>
        </Toast.Body>
      </Toast>
      <Toast mode="alert">
        <Toast.Icon
          icon={exclamationCircleIcon}
          color="var(--cnvs-sys-color-fg-danger-default)"
        />
        <Toast.Body>
          <Toast.Message>
            Publish failed. Two token names collide.
          </Toast.Message>
          <Toast.Link href="#toast">Review names</Toast.Link>
        </Toast.Body>
      </Toast>
    </Stack>
  )
}

function TooltipSpecimen() {
  return (
    <Tooltip title="Save changes">
      <PrimaryButton>Hover me</PrimaryButton>
    </Tooltip>
  )
}

const specimenBySlug: Record<CanvasKitSlug, CanvasKitSpecimen> = {
  'action-bar': ActionBarSpecimen,
  'ai-ingress-button': AiIngressButtonSpecimen,
  avatar: AvatarSpecimen,
  badge: BadgeSpecimen,
  banner: BannerSpecimen,
  box: BoxSpecimen,
  breadcrumbs: BreadcrumbsSpecimen,
  button: ButtonSpecimen,
  card: CardSpecimen,
  checkbox: CheckboxSpecimen,
  'color-picker': ColorPickerSpecimen,
  combobox: ComboboxSpecimen,
  dialog: DialogSpecimen,
  divider: DividerSpecimen,
  expandable: ExpandableSpecimen,
  flex: FlexSpecimen,
  'form-field': FormFieldSpecimen,
  grid: GridSpecimen,
  'information-highlight': InformationHighlightSpecimen,
  kbd: KbdSpecimen,
  'loading-dots': LoadingDotsSpecimen,
  'loading-sparkles': LoadingSparklesSpecimen,
  menu: MenuSpecimen,
  modal: ModalSpecimen,
  'multi-select': MultiSelectSpecimen,
  pagination: PaginationSpecimen,
  pill: PillSpecimen,
  popup: PopupSpecimen,
  radio: RadioSpecimen,
  'segmented-control': SegmentedControlSpecimen,
  select: SelectSpecimen,
  'side-panel': SidePanelSpecimen,
  skeleton: SkeletonSpecimen,
  'status-indicator': StatusIndicatorSpecimen,
  switch: SwitchSpecimen,
  table: TableSpecimen,
  tabs: TabsSpecimen,
  text: TextSpecimen,
  'text-area': TextAreaSpecimen,
  'text-input': TextInputSpecimen,
  toast: ToastSpecimen,
  tooltip: TooltipSpecimen,
}

export function CanvasKitSpecimenView({ entry }: { entry: CanvasKitEntry }) {
  const Specimen = specimenBySlug[entry.slug]

  if (Specimen) {
    return <Specimen entry={entry} />
  }

  return <FallbackSpecimen entry={entry} />
}
