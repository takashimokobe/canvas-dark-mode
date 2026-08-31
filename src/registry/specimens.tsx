import type { ChangeEvent, ReactNode } from 'react'
import { useId, useState, useSyncExternalStore } from 'react'
import { Divider } from '@workday/canvas-kit-preview-react/divider'
import { LoadingSparkles } from '@workday/canvas-kit-preview-react/loading-sparkles'
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
  PrimaryButton,
  SecondaryButton,
  TertiaryButton,
} from '@workday/canvas-kit-react/button'
import { Card } from '@workday/canvas-kit-react/card'
import { Checkbox } from '@workday/canvas-kit-react/checkbox'
import { Expandable } from '@workday/canvas-kit-react/expandable'
import { FormField, FormFieldGroup } from '@workday/canvas-kit-react/form-field'
import { InformationHighlight } from '@workday/canvas-kit-react/information-highlight'
import { Box, Flex } from '@workday/canvas-kit-react/layout'
import { LoadingDots } from '@workday/canvas-kit-react/loading-dots'
import { Pill } from '@workday/canvas-kit-react/pill'
import { SegmentedControl } from '@workday/canvas-kit-react/segmented-control'
import { SidePanel } from '@workday/canvas-kit-react/side-panel'
import { Skeleton } from '@workday/canvas-kit-react/skeleton'
import { Table } from '@workday/canvas-kit-react/table'
import { Text } from '@workday/canvas-kit-react/text'
import { TextInput } from '@workday/canvas-kit-react/text-input'
import { Toast } from '@workday/canvas-kit-react/toast'
import { Tooltip } from '@workday/canvas-kit-react/tooltip'
import {
  checkIcon,
  exclamationCircleIcon,
  gridIcon,
  listViewIcon,
  pieChartIcon,
  plusIcon,
  trashIcon,
  xIcon,
} from '@workday/canvas-system-icons-web'
import { BarChart } from '@/components/Chart'
import type {
  CanvasKitEntry,
  CanvasKitSlug,
  CanvasKitSpecimen,
  CanvasKitSpecimenProps,
} from '@/registry/types'

import styles from './specimens.module.css'

function subscribeHydration() {
  return () => {}
}

/** Canvas Kit `useModalityType` is `mouse` on the server and `touch` below 768px. */
function useHydrated() {
  return useSyncExternalStore(
    subscribeHydration,
    () => true,
    () => false,
  )
}

const THEME_ROWS = [
  { theme: 'Sana Canvas', owner: 'Jordan Lee', status: 'Published' },
  { theme: 'Workday', owner: 'Sam Rivera', status: 'In review' },
  { theme: 'Spotify', owner: 'Riley Chen', status: 'Draft' },
] as const

type TabItem = {
  id: string
  text: string
  contents: string
}

const TAB_ITEMS: TabItem[] = [
  {
    id: 'overview',
    text: 'Overview',
    contents: 'What’s new in 1.4.',
  },
  {
    id: 'themes',
    text: 'Themes',
    contents: 'Active tenants and owners.',
  },
  {
    id: 'pages',
    text: 'Pages',
    contents: 'Cards, publish bar, and preview.',
  },
  {
    id: 'activity',
    text: 'Activity',
    contents: 'Recent publishes and reviews.',
  },
  {
    id: 'settings',
    text: 'Settings',
    contents: 'Who can publish.',
  },
]

function Stage({ children }: { children: ReactNode }) {
  return <div className={styles.Stage}>{children}</div>
}

function Stack({ children }: { children: ReactNode }) {
  return <div className={styles.Stack}>{children}</div>
}

function ActionBarSpecimen() {
  return (
    <ActionBar>
      <ActionBar.List
        as="section"
        aria-label="Action Bar"
        cs={{
          position: 'relative',
          inset: 'unset',
          alignSelf: 'stretch',
        }}
      >
        <ActionBar.Item as={PrimaryButton} icon={plusIcon}>
          Publish theme
        </ActionBar.Item>
        <ActionBar.Item as={SecondaryButton}>Save draft</ActionBar.Item>
        <ActionBar.Item as={TertiaryButton}>Preview</ActionBar.Item>
      </ActionBar.List>
    </ActionBar>
  )
}

function AvatarSpecimen() {
  return (
    <Stack>
      <Stage>
        <Avatar name="Jordan Lee" size="extraSmall" />
        <Avatar name="Sam Rivera" size="small" />
        <Avatar name="Riley Chen" />
        <Avatar name="Alex Kim" size="large" />
      </Stage>
      <Stage>
        <Avatar name="Jordan Lee" variant="blue" />
        <Avatar name="Sam Rivera" variant="amber" />
        <Avatar name="Riley Chen" variant="teal" />
        <Avatar name="Alex Kim" variant="purple" />
      </Stage>
    </Stack>
  )
}

function BadgeSpecimen() {
  return (
    <Stage>
      <CountBadge count={3} />
      <CountBadge count={427} emphasis="low" />
      <CountBadge count={128} limit={99} />
    </Stage>
  )
}

function BannerSpecimen() {
  return (
    <Flex cs={{ flexDirection: 'column', gap: 'var(--cnvs-base-size-200)' }}>
      <Banner>
        <Banner.Icon />
        <Banner.Label>3 drafts need review</Banner.Label>
        <Banner.ActionText>Open list</Banner.ActionText>
      </Banner>
      <Banner hasError>
        <Banner.Icon />
        <Banner.Label>Two themes share a name</Banner.Label>
        <Banner.ActionText>Fix names</Banner.ActionText>
      </Banner>
    </Flex>
  )
}

function BreadcrumbsSpecimen() {
  return (
    <Breadcrumbs
      aria-label="Breadcrumbs"
      cs={{
        display: 'flex',
        justifyContent: 'center',
        inlineSize: '100%',
      }}
    >
      <Breadcrumbs.List
        cs={{
          alignItems: 'center',
          display: 'flex',
          flexWrap: 'nowrap',
          justifyContent: 'center',
          whiteSpace: 'nowrap',
          width: '100%',
        }}
      >
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

function ButtonRow() {
  return (
    <Stage>
      <PrimaryButton icon={plusIcon} iconPosition="start">
        Publish
      </PrimaryButton>
      <SecondaryButton>Save draft</SecondaryButton>
      <TertiaryButton>Preview</TertiaryButton>
      <DeleteButton icon={trashIcon} iconPosition="start">
        Delete
      </DeleteButton>
    </Stage>
  )
}

function ButtonSpecimen() {
  return (
    <Stack>
      <div>
        <p className="visually-hidden">Default theme</p>
        <ButtonRow />
      </div>
      <div data-brand="spotify">
        <p className="visually-hidden">Spotify</p>
        <ButtonRow />
      </div>
    </Stack>
  )
}

function CardSpecimen() {
  return (
    <Stack>
      <Card cs={{ maxWidth: '32rem', inlineSize: '100%' }}>
        <Card.Heading>Visits</Card.Heading>
        <Card.Body>
          <BarChart defaultIndex={1} />
        </Card.Body>
      </Card>
      <Card
        cs={{
          maxWidth: '32rem',
          inlineSize: '100%',
          background: 'var(--cnvs-sys-color-surface-alt-default)',
        }}
        variant="tonal"
      >
        <Card.Heading>Open roles</Card.Heading>
        <Card.Body>
          <BarChart defaultIndex={1} />
        </Card.Body>
      </Card>
      <Card
        cs={{
          maxWidth: '32rem',
          inlineSize: '100%',
          boxShadow: 'var(--cnvs-sys-depth-1)',
        }}
        variant="alt"
      >
        <Card.Heading>This week</Card.Heading>
        <Card.Body>
          <BarChart defaultIndex={1} />
        </Card.Body>
      </Card>
    </Stack>
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
        Sana Canvas 1.4 is ready to publish.
      </Text>
      <Divider space="var(--cnvs-sys-gap-xs)" />
      <Text as="p" typeLevel="body.small">
        Review the changelog before you ship.
      </Text>
    </Flex>
  )
}

const accordionItemCs = { inlineSize: '100%', minInlineSize: 0 }
const accordionContentCs = {
  paddingInline: 'calc(var(--cnvs-sys-padding-xs) * 2)',
}

function ExpandableSpecimen() {
  return (
    <div className={styles.Accordion}>
      <Expandable className={styles.AccordionItem} cs={accordionItemCs}>
        <Expandable.Target headingLevel="h4">
          <Expandable.Title>What shipped</Expandable.Title>
          <Expandable.Icon iconPosition="end" />
        </Expandable.Target>
        <Expandable.Content cs={accordionContentCs}>
          Quiet chrome, a new publish bar, and a dark preview.
        </Expandable.Content>
      </Expandable>
      <Expandable
        className={styles.AccordionItem}
        cs={accordionItemCs}
        initialVisibility="visible"
      >
        <Expandable.Target headingLevel="h4">
          <Expandable.Title>Who can publish</Expandable.Title>
          <Expandable.Icon iconPosition="end" />
        </Expandable.Target>
        <Expandable.Content cs={accordionContentCs}>
          Owners and admins can publish. Reviewers leave comments.
        </Expandable.Content>
      </Expandable>
      <Expandable className={styles.AccordionItem} cs={accordionItemCs}>
        <Expandable.Target headingLevel="h4">
          <Expandable.Title>When it ships</Expandable.Title>
          <Expandable.Icon iconPosition="end" />
        </Expandable.Target>
        <Expandable.Content cs={accordionContentCs}>
          1.4 goes out Friday. Preview stays open until then.
        </Expandable.Content>
      </Expandable>
    </div>
  )
}

function FormFieldSpecimen() {
  const [value, setValue] = useState('Sana Canvas')

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
        <FormField.Label>Theme name</FormField.Label>
        <FormField.Field>
          <FormField.Input
            as={TextInput}
            value={value}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              setValue(event.target.value)
            }
          />
          <FormField.Hint>Shown on the theme card.</FormField.Hint>
        </FormField.Field>
      </FormField>
      <FormField grow error="caution">
        <FormField.Label>Publish window</FormField.Label>
        <FormField.Field>
          <FormField.Input
            as={TextInput}
            value="Yesterday"
            onChange={() => {}}
          />
          <FormField.Hint>This date is in the past.</FormField.Hint>
        </FormField.Field>
      </FormField>
      <FormField grow error="error">
        <FormField.Label>Slug</FormField.Label>
        <FormField.Field>
          <FormField.Input
            as={TextInput}
            value="sana canvas!"
            onChange={() => {}}
          />
          <FormField.Hint>Lowercase letters and dashes only.</FormField.Hint>
        </FormField.Field>
      </FormField>
    </Flex>
  )
}

function InformationHighlightSpecimen() {
  return (
    <Flex
      cs={{
        flexDirection: 'column',
        gap: 'var(--cnvs-sys-gap-sm)',
        maxWidth: '28rem',
      }}
    >
      <InformationHighlight variant="informational" emphasis="high">
        <InformationHighlight.Icon />
        <InformationHighlight.Heading>
          Theme synced
        </InformationHighlight.Heading>
        <InformationHighlight.Body>
          Sana Canvas 1.4 matches the live preview.
        </InformationHighlight.Body>
        <InformationHighlight.Link href="#surfaces">
          Open preview
        </InformationHighlight.Link>
      </InformationHighlight>
      <InformationHighlight variant="caution" emphasis="high">
        <InformationHighlight.Icon />
        <InformationHighlight.Heading>
          Unsaved changes
        </InformationHighlight.Heading>
        <InformationHighlight.Body>
          This theme has 12 unpublished edits. Review them before publishing.
        </InformationHighlight.Body>
        <InformationHighlight.Link href="#caution">
          Review edits
        </InformationHighlight.Link>
      </InformationHighlight>
      <InformationHighlight variant="critical" emphasis="high">
        <InformationHighlight.Icon />
        <InformationHighlight.Heading>
          Publish blocked
        </InformationHighlight.Heading>
        <InformationHighlight.Body>
          Two themes share a name. Publishing will fail until they are unique.
        </InformationHighlight.Body>
        <InformationHighlight.Link href="#critical">
          Fix names
        </InformationHighlight.Link>
      </InformationHighlight>
    </Flex>
  )
}

function LoadingDotsSpecimen() {
  return <LoadingDots role="img" aria-label="Please wait" />
}

function LoadingSparklesSpecimen() {
  return <LoadingSparkles aria-label="Generating" />
}

function PillSpecimen() {
  return (
    <Stage>
      <Pill onClick={() => {}} type="button">
        <Pill.Icon icon={plusIcon} aria-hidden />
        <Pill.Label>Design tokens</Pill.Label>
        <Pill.Count>12</Pill.Count>
      </Pill>
      <Pill variant="removable">
        <Pill.Label>Canvas Kit</Pill.Label>
        <Pill.IconButton aria-label="Remove Canvas Kit" onClick={() => {}} />
      </Pill>
      <Pill variant="readOnly">1.4</Pill>
      <Pill onClick={() => {}} disabled type="button">
        <Pill.Label>Beta</Pill.Label>
      </Pill>
    </Stage>
  )
}

function RadioSpecimen() {
  const name = useId()
  const [appearance, setAppearance] = useState('dark')

  return (
    <FormFieldGroup>
      <FormFieldGroup.Label>Appearance</FormFieldGroup.Label>
      <FormFieldGroup.Field>
        <FormFieldGroup.List
          as={RadioGroup}
          name={name}
          value={appearance}
          onChange={(value) => setAppearance(String(value))}
        >
          <FormFieldGroup.Input as={RadioGroup.RadioButton} value="light">
            Light
          </FormFieldGroup.Input>
          <FormFieldGroup.Input as={RadioGroup.RadioButton} value="dark">
            Dark
          </FormFieldGroup.Input>
          <FormFieldGroup.Input
            as={RadioGroup.RadioButton}
            value="system"
            disabled
          >
            System
          </FormFieldGroup.Input>
        </FormFieldGroup.List>
      </FormFieldGroup.Field>
    </FormFieldGroup>
  )
}

function SegmentedControlSpecimen() {
  const [digest, setDigest] = useState(true)

  return (
    <Stack>
      <SegmentedControl>
        <SegmentedControl.List aria-label="View type">
          <SegmentedControl.Item data-id="table" icon={gridIcon}>
            Table
          </SegmentedControl.Item>
          <SegmentedControl.Item data-id="list" icon={listViewIcon}>
            List
          </SegmentedControl.Item>
          <SegmentedControl.Item data-id="diagram" icon={pieChartIcon}>
            Diagram
          </SegmentedControl.Item>
        </SegmentedControl.List>
      </SegmentedControl>
      <FormField orientation="horizontalStart">
        <FormField.Label>Weekly digest</FormField.Label>
        <FormField.Field>
          <FormField.Input
            as={Switch}
            checked={digest}
            onChange={() => setDigest(!digest)}
          />
        </FormField.Field>
      </FormField>
    </Stack>
  )
}

function SidePanelSpecimen() {
  const hydrated = useHydrated()
  if (!hydrated) {
    return <div className={styles.Pending} aria-hidden />
  }

  return (
    <div className={styles.Viewport}>
      <SidePanel
        variant="alternative"
        expandedWidth={200}
        cs={{ flexShrink: 0 }}
      >
        <SidePanel.ToggleButton aria-label="Collapse themes panel" />
        <SidePanel.Heading size={'small'}>Themes</SidePanel.Heading>
      </SidePanel>
      <div className={styles.ViewportMain}>
        <Text as="p" typeLevel="body.small">
          Sana Canvas stays in view while the panel collapses.
        </Text>
      </div>
    </div>
  )
}

function SkeletonSpecimen() {
  return (
    <Box cs={{ inlineSize: '100%', maxWidth: '20rem' }}>
      <Skeleton>
        <Flex cs={{ gap: 'var(--cnvs-base-size-200)' }}>
          <Skeleton.Shape
            cs={{
              width: 'var(--cnvs-sys-size-md)',
              height: 'var(--cnvs-sys-size-md)',
              borderRadius: 'var(--cnvs-sys-shape-full)',
            }}
          />
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
    <Stage>
      <StatusIndicator emphasis="high" variant="neutral">
        <StatusIndicator.Label>Draft</StatusIndicator.Label>
      </StatusIndicator>
      <StatusIndicator emphasis="high" variant="info">
        <StatusIndicator.Label>In review</StatusIndicator.Label>
      </StatusIndicator>
      <StatusIndicator emphasis="high" variant="positive">
        <StatusIndicator.Icon icon={checkIcon} />
        <StatusIndicator.Label>Published</StatusIndicator.Label>
      </StatusIndicator>
      <StatusIndicator emphasis="high" variant="caution">
        <StatusIndicator.Label>Expiring</StatusIndicator.Label>
      </StatusIndicator>
      <StatusIndicator emphasis="high" variant="critical">
        <StatusIndicator.Icon icon={exclamationCircleIcon} />
        <StatusIndicator.Label>Blocked</StatusIndicator.Label>
      </StatusIndicator>
    </Stage>
  )
}

function SwitchSpecimen() {
  const [notifications, setNotifications] = useState(true)
  const [autoPublish, setAutoPublish] = useState(false)

  return (
    <Flex cs={{ flexDirection: 'column', gap: 'var(--cnvs-base-size-100)' }}>
      <FormField orientation="horizontalStart">
        <FormField.Label>Notifications</FormField.Label>
        <FormField.Field>
          <FormField.Input
            as={Switch}
            checked={notifications}
            onChange={() => setNotifications(!notifications)}
          />
        </FormField.Field>
      </FormField>
      <FormField orientation="horizontalStart">
        <FormField.Label>Auto-publish</FormField.Label>
        <FormField.Field>
          <FormField.Input
            as={Switch}
            checked={autoPublish}
            onChange={() => setAutoPublish(!autoPublish)}
          />
        </FormField.Field>
      </FormField>
      <FormField orientation="horizontalStart">
        <FormField.Label>Legacy mode</FormField.Label>
        <FormField.Field>
          <FormField.Input
            as={Switch}
            disabled
            checked={false}
            onChange={() => {}}
          />
        </FormField.Field>
      </FormField>
    </Flex>
  )
}

function TableSpecimen() {
  return (
    <Table>
      <Table.Caption>Themes in this workspace</Table.Caption>
      <Table.Head>
        <Table.Row>
          <Table.Header scope="col">Theme</Table.Header>
          <Table.Header scope="col">Owner</Table.Header>
          <Table.Header scope="col">Status</Table.Header>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {THEME_ROWS.map((row) => (
          <Table.Row key={row.theme}>
            <Table.Cell>{row.theme}</Table.Cell>
            <Table.Cell>{row.owner}</Table.Cell>
            <Table.Cell>{row.status}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  )
}

function TabsSpecimen() {
  const hydrated = useHydrated()
  if (!hydrated) {
    return <div className={styles.Pending} aria-hidden />
  }

  return (
    <Box cs={{ inlineSize: '100%', maxInlineSize: '28rem' }}>
      <Tabs items={TAB_ITEMS}>
        <Tabs.List
          overflowButton={<Tabs.OverflowButton>More</Tabs.OverflowButton>}
        >
          {(item: TabItem) => <Tabs.Item>{item.text}</Tabs.Item>}
        </Tabs.List>
        <Tabs.Menu.Popper>
          <Tabs.Menu.Card maxWidth={300} maxHeight={200}>
            <Tabs.Menu.List>
              {(item: TabItem) => <Tabs.Menu.Item>{item.text}</Tabs.Menu.Item>}
            </Tabs.Menu.List>
          </Tabs.Menu.Card>
        </Tabs.Menu.Popper>
        <Tabs.Panels>
          {(item: TabItem) => (
            <Tabs.Panel cs={{ marginBlockStart: 'var(--cnvs-sys-gap-lg)' }}>
              <Text as="p" typeLevel="body.small">
                {item.contents}
              </Text>
            </Tabs.Panel>
          )}
        </Tabs.Panels>
      </Tabs>
    </Box>
  )
}

function ToastSpecimen() {
  return (
    <Stack>
      <Toast mode="status">
        <Toast.Icon
          icon={checkIcon}
          color="var(--cnvs-sys-color-brand-fg-positive-default)"
        />
        <Toast.Body>
          <Toast.Message>Sana Canvas 1.4 is ready to publish.</Toast.Message>
        </Toast.Body>
      </Toast>
      <Toast mode="alert">
        <Toast.Icon
          icon={exclamationCircleIcon}
          color="var(--cnvs-sys-color-brand-fg-critical-default)"
        />
        <Toast.Body>
          <Toast.Message>
            Publish failed. Two themes share a name.
          </Toast.Message>
          <Toast.Link href="#toast">Review names</Toast.Link>
        </Toast.Body>
      </Toast>
    </Stack>
  )
}

function TooltipSpecimen({ scheme }: CanvasKitSpecimenProps) {
  return (
    <Stage>
      <Tooltip
        title="Close"
        data-scheme={scheme}
        style={{ colorScheme: scheme }}
      >
        <TertiaryButton icon={xIcon} aria-label="Close" />
      </Tooltip>
      <Tooltip
        type="description"
        title="Opens the changelog for this theme."
        data-scheme={scheme}
        style={{ colorScheme: scheme }}
      >
        <SecondaryButton>Review names</SecondaryButton>
      </Tooltip>
    </Stage>
  )
}

const specimenBySlug: Record<CanvasKitSlug, CanvasKitSpecimen> = {
  'action-bar': ActionBarSpecimen,
  avatar: AvatarSpecimen,
  badge: BadgeSpecimen,
  banner: BannerSpecimen,
  breadcrumbs: BreadcrumbsSpecimen,
  button: ButtonSpecimen,
  card: CardSpecimen,
  checkbox: CheckboxSpecimen,
  divider: DividerSpecimen,
  expandable: ExpandableSpecimen,
  'form-field': FormFieldSpecimen,
  'information-highlight': InformationHighlightSpecimen,
  'loading-dots': LoadingDotsSpecimen,
  'loading-sparkles': LoadingSparklesSpecimen,
  pill: PillSpecimen,
  radio: RadioSpecimen,
  'segmented-control': SegmentedControlSpecimen,
  'side-panel': SidePanelSpecimen,
  skeleton: SkeletonSpecimen,
  'status-indicator': StatusIndicatorSpecimen,
  switch: SwitchSpecimen,
  table: TableSpecimen,
  tabs: TabsSpecimen,
  toast: ToastSpecimen,
  tooltip: TooltipSpecimen,
}

export function CanvasKitSpecimenView({
  entry,
  scheme,
}: {
  entry: CanvasKitEntry
  scheme: CanvasKitSpecimenProps['scheme']
}) {
  const Specimen = specimenBySlug[entry.slug]
  return <Specimen entry={entry} scheme={scheme} />
}
